
import { useState, useEffect } from 'react';
import { Container, Title, Button, Group, Text, Stack, Card, Center, Alert, Box, Badge, Select } from '@mantine/core';
import { Link } from '@remix-run/react';
import jsPDF from 'jspdf';

interface Scanner {
  value: string;
  label: string;
  ip: string;
}

export default function Scan() {
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [scanners, setScanners] = useState<Scanner[]>([]);
  const [scannersLoading, setScannersLoading] = useState(true);

  // スキャナーリストを取得
  useEffect(() => {
    const fetchScanners = async () => {
      try {
        const response = await fetch('/api/scanners');
        const data = await response.json();
        setScanners(data.scanners);
        
        // デフォルトデバイスを設定
        if (data.scanners.length > 0) {
          setSelectedDevice(data.scanners[0].value);
        }
      } catch (error) {
        console.error('Failed to fetch scanners:', error);
        setError('スキャナーリストの取得に失敗しました');
      } finally {
        setScannersLoading(false);
      }
    };

    fetchScanners();
  }, []);

  const handleScan = async () => {
    setLoading(true);
    setError('');
    setImg(null);
    try {
      const formData = new FormData();
      formData.append('device', selectedDevice);
      
      const res = await fetch('/api/scan', { 
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        setError('スキャンに失敗しました');
        setLoading(false);
        return;
      }
      const contentType = res.headers.get('Content-Type') || '';
      if (!contentType.startsWith('image/')) {
        setError('画像データの取得に失敗しました（Content-Type: ' + contentType + '）');
        setLoading(false);
        return;
      }
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.toString();
        console.log('base64data:', base64data);
        if (base64data && base64data.startsWith('data:image/')) {
          setImg(base64data);
        } else {
          setError('画像データの変換に失敗しました');
        }
        setLoading(false);
      };
      reader.onerror = () => {
        setError('画像データの変換に失敗しました');
        setLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      setError('スキャンに失敗しました');
      setLoading(false);
    }
  };

  // PNG形式でダウンロード
  const downloadAsPNG = () => {
    if (!img) return;
    
    const link = document.createElement('a');
    link.href = img;
    link.download = `scan_${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JPG形式でダウンロード
  const downloadAsJPG = () => {
    if (!img) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      
      // 白い背景を追加（JPGは透明度をサポートしないため）
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `scan_${new Date().getTime()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/jpeg', 0.9);
      }
    };
    
    image.src = img;
  };

  // PDF形式でダウンロード
  const downloadAsPDF = () => {
    if (!img) return;
    
    const image = new Image();
    image.onload = () => {
      const pdf = new jsPDF();
      
      // 画像のサイズを取得
      const imgWidth = image.width;
      const imgHeight = image.height;
      
      // PDFページのサイズ（A4）
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // 画像をページに収まるようにリサイズ
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;
      
      // 中央に配置
      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;
      
      pdf.addImage(img, 'PNG', x, y, width, height);
      pdf.save(`scan_${new Date().getTime()}.pdf`);
    };
    
    image.src = img;
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Center>
          <Stack align="center" gap="sm">
            <Title order={1} c="green">📄 ドキュメントスキャン</Title>
            <Text c="dimmed">紙の書類をデジタル化します</Text>
            <Button component={Link} to="/" variant="subtle" size="sm">
              ← トップページに戻る
            </Button>
          </Stack>
        </Center>

        <Card shadow="md" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Select
              label="スキャナーデバイス"
              placeholder="使用するスキャナーを選択してください"
              value={selectedDevice}
              onChange={(value) => setSelectedDevice(value || '')}
              data={scanners.map(scanner => ({
                value: scanner.value,
                label: scanner.label
              }))}
              allowDeselect={false}
              disabled={scannersLoading || scanners.length === 0}
              description={scannersLoading ? 'スキャナーを検索中...' : scanners.length === 0 ? 'スキャナーが見つかりません' : `${scanners.length}台のスキャナーが利用可能です`}
            />

            <Group justify="center">
              <Button 
                onClick={handleScan} 
                loading={loading}
                size="lg"
                variant="gradient" 
                gradient={{ from: 'green', to: 'teal' }}
                disabled={loading || !selectedDevice || scanners.length === 0}
              >
                {loading ? 'スキャン中...' : '📄 スキャン開始'}
              </Button>
            </Group>

            {error && (
              <Alert color="red" title="エラーが発生しました">
                {error}
              </Alert>
            )}

            {img && (
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text fw={600}>スキャン結果</Text>
                    <Badge color="green" variant="light">完了</Badge>
                  </Group>
                  <Box style={{ textAlign: 'center' }}>
                    <img 
                      src={img} 
                      alt="スキャン画像" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '500px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </Box>
                  
                  <Card shadow="xs" padding="sm" radius="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
                    <Stack gap="xs">
                      <Text size="sm" fw={500} ta="center" c="dimmed">
                        📥 ダウンロード
                      </Text>
                      <Group justify="center" gap="sm">
                        <Button
                          size="sm"
                          variant="filled"
                          color="blue"
                          onClick={downloadAsPNG}
                        >
                          PNG
                        </Button>
                        <Button
                          size="sm"
                          variant="filled"
                          color="orange"
                          onClick={downloadAsJPG}
                        >
                          JPG
                        </Button>
                        <Button
                          size="sm"
                          variant="filled"
                          color="red"
                          onClick={downloadAsPDF}
                        >
                          PDF
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                </Stack>
              </Card>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
