import "@mantine/core/styles.css";
import { Alert, Container, Loader, MantineProvider, Paper, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getHealth } from "./api/sdk.gen";

function App() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => {
    const controller = new AbortController();
    getHealth({ signal: controller.signal, baseUrl: "" })
      .then(({ data, error }) => setStatus(!error && data?.status === "ok" ? "ok" : "error"))
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => controller.abort();
  }, []);
  return (
    <MantineProvider>
      <Container size="sm" py="xl">
        <Paper withBorder p="xl" radius="md">
          <Title order={1}>Календарь звонков</Title>
          <Text c="dimmed" my="md">
            Основа приложения для бронирования встреч
          </Text>
          {status === "loading" && <Loader aria-label="Проверяем сервер" />}
          {status === "ok" && <Alert color="green">Сервер работает</Alert>}
          {status === "error" && (
            <Alert color="red">Сервер недоступен. Проверьте запуск и обновите страницу.</Alert>
          )}
        </Paper>
      </Container>
    </MantineProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
