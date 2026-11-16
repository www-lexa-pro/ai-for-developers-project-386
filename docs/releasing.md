# Выпуск версии

У приложения одна версия для Go и React. Release-please собирает Conventional
Commits в PR с `CHANGELOG.md`, `version.txt` и `.release-please-manifest.json`.
После принятия этого PR в `main` следующий запуск создаёт тег `v<версия>` и
GitHub Release. Сборка, развёртывание, npm publish и Docker сюда не входят.

## Начальная версия и история

Корневой пакет использует стратегию `simple`. Пустой manifest означает, что
опубликованных версий ещё нет; `version.txt` содержит исходное `0.0.0`.
`initial-version: 0.1.0` задаёт первую предлагаемую версию, а не принудительную
версию каждого следующего выпуска. После первого выпуска версия вычисляется
по Conventional Commits: `feat` повышает minor, `fix` — patch,
`BREAKING CHANGE` — major. Документация и служебные изменения сами по себе
обычно не создают релиз.

`bootstrap-sha` указывает на `2f2a9c27535076ca3ac28e8eeba48643324bf51b`:
коммиты после него включают первую реальную функцию каталога #6. После первого
принятого release PR эта граница больше не применяется. Не нужно добавлять
фиктивный `feat` или вручную создавать тег для запуска автоматики.

## Настройки владельца

В Settings → Actions → General → Workflow permissions включить
**Allow GitHub Actions to create and approve pull requests**. Политика
организации может запрещать эту настройку — тогда её меняет владелец организации.
Проверка API 16.11.2026 показала `can_approve_pull_request_reviews: false`:
создание PR ещё требует этого действия владельца. Настройки в этой задаче
не изменялись.

Workflow запрашивает `contents: write` для ветки/тега/Release и
`pull-requests: write` для release PR и `issues: write` для служебных меток
release-please; используется встроенный `GITHUB_TOKEN`,
добавлять секрет не нужно. Вне release job остаётся `contents: read`.
Защита `main`, требуемые проверки и правила создания тегов продолжают действовать;
автоматического принятия PR нет.

События от `GITHUB_TOKEN` не запускают другие workflows. Поэтому созданный ботом
release PR не получает обычные проверки по push/pull_request автоматически.
Перед его принятием проверить **точную вершину** ветки PR локально командой
`mise run check` и `node scripts/check-commits.mjs`. Если правила требуют именно
GitHub checks и не разрешают принятие, остановиться: применение GitHub App/PAT
или изменение правил требует отдельного решения владельца. В этом решении
другого токена нет. Release-событие также не запускает публикацию приложения.

## Проверка и выпуск

1. Принять настройку вместе с реальной функцией #6 в `main`. До этого workflow
   не работает: он слушает только push в `main` и ручной запуск на `main`.
2. Проверить запуск «Подготовка и выпуск версии» и созданный release PR.
   Первый ожидаемый результат: версия `0.1.0`, запись каталога в CHANGELOG,
   обновлённые `version.txt` и manifest. Проверить отсутствие лишних изменений.
3. Выполнить проверки точной вершины release PR, затем принять его в `main`.
4. Дождаться следующего запуска workflow; проверить GitHub Release `v0.1.0`,
   одноимённый тег и соответствие тега коммиту принятого release PR.
   Версия в manifest, `version.txt` и CHANGELOG должна совпадать.
   Только после этого подтверждён полный цикл #11.

Для повторного запуска после исправления разрешений можно выбрать Actions →
«Подготовка и выпуск версии» → Run workflow → `main`. Это настоящий запуск:
он может создать/обновить PR либо выпустить уже принятый release PR.

Для предварительного расчёта используется официальный CLI с `--dry-run`:

```bash
release-please release-pr \
  --repo-url=www-lexa-pro/ai-for-developers-project-386 \
  --target-branch=main --dry-run
```

CLI требует авторизацию (`GITHUB_TOKEN` в окружении) и читает конфигурацию,
manifest и историю **с GitHub**, а не из локального checkout. Не печатайте токен
в терминал или журнал. Для проверки до `main` нужна отдельно согласованная
опубликованная ветка с этой конфигурацией и `--target-branch=<ветка>`.
Dry-run показывает рассчитанные изменения PR, но не подтверждает право создать
PR, работу Actions или выпуск тега и Release.

На этапе локальной подготовки release PR не создан и не принят, тег и Release
не выпускались. Полный цикл остаётся непроверенным до шагов владельца выше.
Успешный `mise run check` проверяет приложение и синтаксис собственного workflow;
он не подменяет эту проверку на GitHub.

Источники: [action и ограничения токена](https://github.com/googleapis/release-please-action),
[manifest и начальная история](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md),
[схема initial-version](https://github.com/googleapis/release-please/blob/main/schemas/config.json),
[CLI](https://github.com/googleapis/release-please/blob/main/docs/cli.md).
