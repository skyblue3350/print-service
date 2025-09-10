
import { useState } from 'react';
import { Container, Title, Button, Group, Image, Text } from '@mantine/core';

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
    <Container>
      <Title order={2}>スキャン</Title>
      <Group mt="md">
        <Button onClick={handleScan} loading={loading}>スキャン開始</Button>
      </Group>
      {error && <Text color="red" mt="md">{error}</Text>}
  {img && <img src={img} alt="スキャン画像" style={{ marginTop: 16, maxWidth: '100%' }} />}
    </Container>
  );
}
