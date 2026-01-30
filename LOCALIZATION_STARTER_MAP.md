# Localization Starter Map (en-GB, es-ES, fr, de, pt-BR, ru)

This file maps the repo, summarizes the commit range `ca6fd2d85b5e9f709bf5fe9331c7cb6bf2fdc234..5415de3c30c5251e51d36a930be2f75d88185864`, and provides strict Claude Code instructions plus a step-by-step plan to start coding localizations for:
`en-GB`, `es-ES`, `fr`, `de`, `pt-BR`, `ru`.

---

## 0) Commit Range Check (Required Context)
Commits in range:
- `0ca33fa` - Update Multi-Lang (localized guards/events, added dev keys, localized createPage)
- `5f5aee3` - Locale files updated (added unknown/live/help authorTitle and localized usage)
- `5415de3` - Commands Updated (added description_localizations for id, fr, ja, ko, zh-CN)

Files touched in the range:
- Commands: `src/commands/interaction/**`, `src/commands/message/dev/**`
- Events: `src/events/bot/guild/**`, `src/events/rainlink/player/**`
- Helpers: `src/functions/createPage.js`, `src/utils/i18n.js`
- Locales: `src/locales/*.json`
- Docs: `CLAUDE_CODE_GUIDE.md`, `CLAUDE_CODE_INSTRUCTIONS.md`

This range implements i18n end-to-end and adds slash `description_localizations` for the currently supported UI locales.

---

## 1) Full Repo File Map (As of now)
Root:
- `.dockerignore`, `.env.example`, `.gitattributes`, `.gitignore`, `.prettierrc`
- `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `LICENSE`, `README.md`, `SECURITY.md`
- `docker-compose.yml`, `Dockerfile`, `package.json`

GitHub:
- `.github/dependabot.yml`
- `.github/FUNDING.yml`
- `.github/ISSUE_TEMPLATE/bug_report.yaml`
- `.github/ISSUE_TEMPLATE/feature_request.yaml`
- `.github/workflows/jekyll-gh-pages.yml`

Core:
- `src/index.js`
- `src/clients/lunox.js`, `src/clients/manager.js`
- `src/handlers/anticrash.js`, `src/handlers/commands.js`, `src/handlers/database.js`, `src/handlers/events.js`, `src/handlers/rainlink.js`

Commands:
- Slash: `src/commands/interaction/**` (general, music, setting)
- Prefix/dev: `src/commands/message/dev/**`

Events:
- Bot: `src/events/bot/**`
- Rainlink: `src/events/rainlink/**`

Data:
- `src/databases/connector.js`, `src/databases/updater.js`
- `src/databases/schema/guild.js`, `src/databases/schema/user.js`

Utilities:
- `src/functions/createData.js`, `src/functions/createPage.js`, `src/functions/getPermission.js`, `src/functions/timeFormat.js`
- `src/utils/i18n.js`, `src/utils/logger.js`

Settings:
- `src/settings/config.js`, `src/settings/emoji.js`

Locales:
- `src/locales/en-US.json`, `src/locales/id-ID.json`, `src/locales/ja-JP.json`, `src/locales/ko-KR.json`, `src/locales/zh-CN.json`, `src/locales/fr-FR.json`

Docs:
- `CLAUDE_CODE_GUIDE.md`, `CLAUDE_CODE_INSTRUCTIONS.md`

---

## 2) Strict Claude Code Instructions (Mandatory)
- Use **PowerShell** only; prefer `rg` for search.
- No destructive commands unless explicitly asked.
- No network usage or package installs unless asked.
- Do not edit `.env`; only `.env.example` if requested.
- No new dependencies without approval.
- Keep changes minimal and localized to the request.
- Respect formatting: **JS = 4 spaces**, **JSON = 2 spaces**.
- If you touch **user-facing text**, you must use i18n (`t()` + locale keys).
- Any new i18n key must be added to **all locale files**.

---

## 3) Localization Architecture (Current)
- Runtime i18n uses `src/utils/i18n.js`:
  - `t(locale, "key.path", vars)`
  - `resolveLocale(client, guildId, userId)`
- Locale files are JSON at `src/locales/*.json`
- Slash UI localizations use `name_localizations` / `description_localizations` in command definitions.

### Runtime Key Areas
Use these key groups consistently:
- `common.*`
- `categories.*`
- `player.*`
- `errors.*`
- `commands.<command>.*`
- `events.*`
- `dev.<command>.*`

---

## 4) Target Locales (New Work)
We are adding runtime + slash UI support for:
- `en-GB` (English, UK)
- `es-ES` (Spanish)
- `fr` (French)
- `de` (German)
- `pt-BR` (Portuguese, Brazil)
- `ru` (Russian)

### Decision: Runtime file names
Use **the same codes as the locales above** for runtime file names to avoid mapping logic.

Create files:
- `src/locales/en-GB.json`
- `src/locales/es-ES.json`
- `src/locales/fr.json`
- `src/locales/de.json`
- `src/locales/pt-BR.json`
- `src/locales/ru.json`

### Note about existing `fr-FR.json`
Current runtime uses `fr-FR.json`. For the new `fr` locale:
- Preferred: create `src/locales/fr.json` by copying `fr-FR.json`, then treat `fr` as canonical.
- Optional: keep `fr-FR.json` for backward compatibility, but **do not** use it in `supportedLocales` unless explicitly requested.

---

## 5) Required Code Changes (Checklist)
### 5.1 Add locale files (runtime)
Copy from `src/locales/en-US.json` (or `fr-FR.json` for French) and translate.

### 5.2 Update config
In `src/settings/config.js`:
```js
supportedLocales: ["en-US", "id-ID", "ja-JP", "ko-KR", "zh-CN", "fr-FR", "en-GB", "es-ES", "fr", "de", "pt-BR", "ru"]
```

### 5.3 Update /language command
In `src/commands/interaction/setting/language.js`:
Add choices for the new locales (names should be human-readable):
```js
{ name: "English (UK)", value: "en-GB" },
{ name: "Español", value: "es-ES" },
{ name: "Français", value: "fr" },
{ name: "Deutsch", value: "de" },
{ name: "Português (Brasil)", value: "pt-BR" },
{ name: "Русский", value: "ru" }
```

### 5.4 Add slash UI localizations
For each command under `src/commands/interaction/**`:
Add these locale keys to `name_localizations` and `description_localizations`:
`en-GB`, `es-ES`, `fr`, `de`, `pt-BR`, `ru`

Example:
```js
name_localizations: {
  "en-GB": "play",
  "es-ES": "reproducir",
  "fr": "jouer",
  "de": "abspielen",
  "pt-BR": "tocar",
  "ru": "igrat"
},
description_localizations: {
  "en-GB": "Play a song",
  "es-ES": "Reproduce una cancion",
  "fr": "Jouer une chanson",
  "de": "Ein Lied abspielen",
  "pt-BR": "Tocar uma musica",
  "ru": "Vosp poizvesti pesnyu"
}
```

For options, repeat at the option level:
```js
{
  name: "query",
  description: "Provide a song name or url",
  name_localizations: { "es-ES": "busqueda", "fr": "requete", "de": "suche", "pt-BR": "busca", "ru": "zapros" },
  description_localizations: {
    "es-ES": "Proporciona nombre o URL",
    "fr": "Donnez un titre ou une URL",
    "de": "Gib einen Titel oder eine URL an",
    "pt-BR": "Informe um nome ou URL",
    "ru": "Uкажите название или URL"
  },
  type: 3,
  required: true
}
```

---

## 6) What to Translate (Runtime Keys)
You must translate every key in the runtime locale files. Use `en-US.json` as the baseline.

Key areas and examples:
- `common.*` (support button, yes/no, loading, unknown, noDataFound, useHelpCommand)
- `errors.*` (permissions, maintenance, banned, etc.)
- `player.*` (Now Playing, Duration, Requested by)
- `commands.*` (all per-command strings)
- `events.*` (track errors, inactivity, queue empty)
- `dev.*` (ban/unban/maintenance/lavalink output)

---

## 7) Example: Add a New Key (Runtime)
If you add a new user-facing message:
1) Add to **all** locale files:
```json
"errors": {
  "newError": "Example error text"
}
```
2) Use it in code:
```js
const locale = resolveLocale(client, interaction.guildId, interaction.user.id);
embed.setDescription(t(locale, "errors.newError"));
```

---

## 8) Quality Gate (Before Final Response)
- All new locale files exist.
- All locale files include all keys.
- `supportedLocales` and `/language` choices include new locales.
- All user-facing strings remain localized via `t(...)`.
- Slash `name_localizations` / `description_localizations` include new locales.

---

## 9) Recommended Order of Work
1) Add new locale JSON files (copy from `en-US.json`).
2) Add to `supportedLocales`.
3) Update `/language` choices.
4) Add command UI localizations.
5) Translate runtime locale files.

---

## 10) Notes for Claude Code (Strict)
- Do not modify behavior unless requested.
- Do not add new dependencies.
- Do not change logging language.
- Keep formatting consistent with existing files.

---

End of file.
