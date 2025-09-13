
import { useState } from 'react';
import { Container, Title, Button, Group, Text, Stack, Card, Center, Alert, Box, Badge } from '@mantine/core';
import { Link } from '@remix-run/react';

export default function Scan() {
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    setLoading(true);
    setError('');
    setImg(null);
    try {
      const res = await fetch('/api/scan', { method: 'POST' });
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
            <Group justify="center">
              <Button 
                onClick={handleScan} 
                loading={loading}
                size="lg"
                variant="gradient" 
                gradient={{ from: 'green', to: 'teal' }}
                disabled={loading}
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
                </Stack>
              </Card>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
