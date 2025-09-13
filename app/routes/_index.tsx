import { Title, Container, Card, SimpleGrid, Button, Text, Stack, Center, ThemeIcon } from '@mantine/core';
import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <Container size="md" py="xl">
      <Center mb="xl">
        <Stack align="center" gap="md">
          <Title order={1} size="h1" c="blue">Print Service</Title>
          <Text size="lg" c="dimmed">印刷・スキャンサービスへようこそ</Text>
        </Stack>
      </Center>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Card shadow="md" padding="lg" radius="md" withBorder>
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
              <Text size="xl" fw={700}>🖨</Text>
            </ThemeIcon>
            <Title order={3}>ファイル印刷</Title>
            <Text ta="center" c="dimmed">
              PDFやドキュメントファイルを印刷できます
            </Text>
            <Button 
              component={Link} 
              to="/print" 
              variant="gradient" 
              gradient={{ from: 'blue', to: 'cyan' }}
              size="md"
              fullWidth
            >
              印刷ページへ
            </Button>
          </Stack>
        </Card>

        <Card shadow="md" padding="lg" radius="md" withBorder>
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="md" variant="gradient" gradient={{ from: 'green', to: 'teal' }}>
              <Text size="xl" fw={700}>📄</Text>
            </ThemeIcon>
            <Title order={3}>ドキュメントスキャン</Title>
            <Text ta="center" c="dimmed">
              紙の書類をデジタル化してスキャンできます
            </Text>
            <Button 
              component={Link} 
              to="/scan" 
              variant="gradient" 
              gradient={{ from: 'green', to: 'teal' }}
              size="md"
              fullWidth
            >
              スキャンページへ
            </Button>
          </Stack>
        </Card>
      </SimpleGrid>
    </Container>
  );
}
