import { expect, test } from "@playwright/test";
import type { Availability } from "../src/api/types.gen";

test("владелец создаёт тип, гость записывается, владелец видит точную встречу", async ({
  page,
}) => {
  await page.goto("/");
  for (const name of ["Знакомство", "Консультация", "Подробный разбор"])
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.getByRole("link", { name: "Для владельца" }).click();
  await page.getByLabel("Название", { exact: true }).fill("Проверка полного пути");
  await page.getByLabel("Описание", { exact: true }).fill("Встреча из настоящего браузера");
  await page.getByLabel("Длительность, минут").fill("45");
  await page.getByRole("button", { name: "Создать тип", exact: true }).click();
  await expect(page.getByText("Тип встречи создан", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Запись на звонок — главная" }).click();
  const type = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Проверка полного пути", exact: true }) });
  const availabilityResponse = page.waitForResponse(
    (response) => response.url().endsWith("/availability") && response.status() === 200,
  );
  await type.getByRole("link").click();
  const availability: Availability = await (await availabilityResponse).json();
  expect(availability.days).toHaveLength(14);
  const day = availability.days.find((day) => day.slots.length > 0)!;
  expect(day).toBeTruthy();
  const slot = day.slots[0];
  const dayLabel = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Moscow",
  }).format(new Date(slot.start));
  const time = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  });
  const interval = `${time.format(new Date(slot.start))}–${time.format(new Date(slot.end))}`;
  await page.getByRole("button", { name: dayLabel, exact: true }).click();
  await page.getByRole("button", { name: interval, exact: true }).click();
  await page.getByLabel("Имя", { exact: true }).fill("Алексей");
  await page.getByLabel("Email", { exact: true }).fill("A+browser@Example.com");
  await page.getByRole("button", { name: "Записаться", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Вы записаны" })).toBeVisible();
  await expect(page.getByText("Проверка полного пути", { exact: true })).toHaveCount(2);
  const fullDate = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Moscow",
  }).format(new Date(slot.start));
  await expect(page.getByText(`${fullDate}, ${interval} (Москва)`, { exact: true })).toBeVisible();
  await expect(page.getByText("Алексей", { exact: true })).toBeVisible();
  await expect(page.getByText("A+browser@Example.com", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Для владельца" }).click();
  const meetings = page.getByRole("region", { name: "Предстоящие встречи" });
  await expect(meetings.getByRole("heading", { name: "Проверка полного пути" })).toBeVisible();
  for (const value of [
    "Алексей",
    "A+browser@Example.com",
    `${interval} (Москва)`,
    "45 мин",
    new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow" }).format(new Date(slot.start)),
  ])
    await expect(meetings.getByText(value, { exact: true })).toBeVisible();
});
