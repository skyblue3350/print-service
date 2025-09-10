import { useState } from 'react';
import { Container, Title, FileInput, Button, Group, Text } from '@mantine/core';

export default function Print() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');

  const handlePrint = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/print', { method: 'POST', body: formData });
    const data = await res.json();
    setResult(data.message);
  };

  return (
    <Container>
      <Title order={2}>ファイル印刷</Title>
      <FileInput label="印刷するファイルを選択" value={file} onChange={setFile} />
      <Group mt="md">
        <Button onClick={handlePrint} disabled={!file}>印刷</Button>
      </Group>
      {result && <Text mt="md">{result}</Text>}
    </Container>
  );
}
