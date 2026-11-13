import "@mantine/core/styles.css";
import { Badge, Button, Container, Group, MantineProvider, Text, Title } from "@mantine/core";
import { createRoot } from "react-dom/client";
import "./styles.css";

const meetingTypes = [
  {
    name: "Знакомство",
    duration: 15,
    description: "Познакомимся, обсудим ваш вопрос и поймём, чем я могу помочь.",
    label: "Первый шаг",
    color: "sage",
  },
  {
    name: "Консультация",
    duration: 30,
    description: "Сосредоточимся на конкретной задаче и наметим следующие шаги.",
    label: "От вопроса к решению",
    color: "sand",
  },
  {
    name: "Подробный разбор",
    duration: 60,
    description: "Погрузимся в детали, разберём варианты и составим план действий.",
    label: "Время для деталей",
    color: "lilac",
  },
];

function App() {
  return (
    <MantineProvider theme={{ primaryColor: "dark", fontFamily: "Inter, Arial, sans-serif" }}>
      <Container size={1120} className="page">
        <header className="header">
          <a className="brand" href="/" aria-label="Запись на звонок — главная">
            <span className="brand-mark" aria-hidden="true">
              ↗
            </span>
            Запись на звонок
          </a>
          <Button variant="subtle" color="dark" disabled>
            Для владельца · скоро
          </Button>
        </header>
        <main>
          <section className="intro" aria-labelledby="page-title">
            <Badge variant="light" color="dark" radius="sm">
              Время для разговора
            </Badge>
            <Title id="page-title" order={1}>
              Хороший разговор
              <br />
              начинается со встречи.
            </Title>
            <Text className="lead">
              Выберите формат, который подходит вашему вопросу.
              <br className="desktop-break" /> На следующем шаге можно будет подобрать удобное
              время.
            </Text>
            <Group gap="xs" className="schedule">
              <span className="status-dot" aria-hidden="true" />
              <Text size="sm">Пн–пт, 09:00–18:00</Text>
              <span aria-hidden="true">·</span>
              <Text size="sm">Московское время (UTC+3)</Text>
            </Group>
          </section>
          <section aria-labelledby="formats-title" className="formats">
            <div className="section-heading">
              <Title order={2} id="formats-title">
                Выберите формат встречи
              </Title>
              <Text size="sm" c="dimmed">
                01 — Формат
              </Text>
            </div>
            <div className="meeting-grid">
              {meetingTypes.map((meeting) => (
                <article key={meeting.name} className={`meeting-card ${meeting.color}`}>
                  <div className="card-top">
                    <span className="meeting-symbol" aria-hidden="true">
                      {meeting.duration === 15 ? "✳" : meeting.duration === 30 ? "↗" : "✴"}
                    </span>
                    <span className="duration">{meeting.duration} мин</span>
                  </div>
                  <Text className="eyebrow">{meeting.label}</Text>
                  <Title order={3}>{meeting.name}</Title>
                  <Text className="description">{meeting.description}</Text>
                  <Button fullWidth disabled variant="white" className="booking-button">
                    Выбрать время · скоро
                  </Button>
                </article>
              ))}
            </div>
            <Text size="sm" c="dimmed" className="preview-note">
              Это примеры встреч. Выбор времени и запись пока недоступны.
            </Text>
          </section>
          <aside className="booking-info" aria-label="Условия записи">
            <span className="info-symbol" aria-hidden="true">
              ↗
            </span>
            <div>
              <Text fw={600}>Ваш вопрос. Подходящий формат. Удобное время.</Text>
              <Text size="sm" c="dimmed">
                Запись без регистрации · На ближайшие 14 дней начиная с завтра
              </Text>
            </div>
          </aside>
        </main>
        <footer className="footer">
          <Text size="sm">Запись на звонок</Text>
          <Text size="sm">Меньше переписки — больше разговора.</Text>
        </footer>
      </Container>
    </MantineProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
