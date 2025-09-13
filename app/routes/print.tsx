import { useState } from 'react';
import { Container, Title, FileInput, Button, Group, Text, Stack, Card, Center, Alert, Badge } from '@mantine/core';
import { Link } from '@remix-run/react';

export default function Print() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
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
            
            <Group justify="center">
              <Button 
                onClick={handlePrint} 
                disabled={!file || loading}
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
