import { useState, useEffect } from 'react';
import { Container, Title, FileInput, Button, Group, Text, Stack, Card, Center, Alert, Badge, Select, Loader } from '@mantine/core';
import { Link } from '@remix-run/react';

interface Printer {
  value: string;
  label: string;
  name: string;
  status: string;
  description: string;
}

export default function Print() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loadingPrinters, setLoadingPrinters] = useState(true);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // プリンターリストを取得
  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const res = await fetch('/api/printers');
        const data = await res.json();
        setPrinters(data.printers || []);
        // 最初のプリンターを自動選択
        if (data.printers && data.printers.length > 0) {
          setSelectedPrinter(data.printers[0].value);
        }
      } catch (e) {
        console.error('プリンターリストの取得に失敗しました:', e);
      } finally {
        setLoadingPrinters(false);
      }
    };

    fetchPrinters();
  }, []);

  const handlePrint = async () => {
    if (!file || !selectedPrinter) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('printer', selectedPrinter);
    try {
      const res = await fetch('/api/print', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data.message);
    } catch (e) {
      setResult('印刷処理でエラーが発生しました');
    }
    setLoading(false);
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Center>
          <Stack align="center" gap="sm">
            <Title order={1} c="blue">🖨 ファイル印刷</Title>
            <Text c="dimmed">PDFやドキュメントファイルを印刷します</Text>
            <Button component={Link} to="/" variant="subtle" size="sm">
              ← トップページに戻る
            </Button>
          </Stack>
        </Center>

        <Card shadow="md" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <FileInput 
              label="印刷するファイルを選択してください" 
              placeholder="ファイルを選択..."
              value={file} 
              onChange={setFile}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              size="md"
            />

            {loadingPrinters ? (
              <Group justify="center">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">プリンターを検索中...</Text>
              </Group>
            ) : (
              <Select
                label="プリンターを選択してください"
                placeholder={printers.length === 0 ? "利用可能なプリンターがありません" : "プリンターを選択..."}
                data={printers.map(printer => ({
                  value: printer.value,
                  label: printer.label
                }))}
                value={selectedPrinter}
                onChange={(value) => setSelectedPrinter(value || '')}
                size="md"
                disabled={printers.length === 0}
              />
            )}
            
            <Group justify="center">
              <Button 
                onClick={handlePrint} 
                disabled={!file || !selectedPrinter || loading || printers.length === 0}
                loading={loading}
                size="lg"
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan' }}
              >
                {loading ? '印刷中...' : '🖨 印刷開始'}
              </Button>
            </Group>

            {result && (
              <Alert 
                color={result.includes('成功') || result.includes('開始') ? 'green' : 'red'} 
                title={result.includes('成功') || result.includes('開始') ? '印刷処理完了' : 'エラーが発生しました'}
              >
                {result}
              </Alert>
            )}

            {selectedPrinter && printers.length > 0 && (
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Group justify="space-between" align="center">
                  <div>
                    <Text fw={600}>選択されたプリンター</Text>
                    <Text size="sm" c="dimmed">
                      {printers.find(p => p.value === selectedPrinter)?.label || selectedPrinter}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {printers.find(p => p.value === selectedPrinter)?.status || ''}
                    </Text>
                  </div>
                  <Badge color="green" variant="light">選択済み</Badge>
                </Group>
              </Card>
            )}

            {!loadingPrinters && printers.length === 0 && (
              <Alert color="yellow" title="プリンターが見つかりません">
                利用可能なプリンターが検出されませんでした。プリンターが正しく設定されているか確認してください。
              </Alert>
            )}

            {file && (
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Group justify="space-between" align="center">
                  <div>
                    <Text fw={600}>選択されたファイル</Text>
                    <Text size="sm" c="dimmed">{file.name}</Text>
                    <Text size="xs" c="dimmed">{(file.size / 1024).toFixed(1)} KB</Text>
                  </div>
                  <Badge color="blue" variant="light">準備完了</Badge>
                </Group>
              </Card>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
