# Claude Code Instructions for Lunox

This file defines **strict, repo-specific rules** for using Claude Code in this project. Follow these instructions exactly.

## 1) Operating Rules (Mandatory)
- **Use PowerShell commands** (project is on Windows). Avoid bash-specific syntax.
- **Prefer `rg` for search** (fastest): `rg "pattern" -g "glob"` or `rg --files`.
- **Do not use destructive commands** (e.g., `git reset --hard`, `git checkout --`, `rm -rf`) unless explicitly requested.
- **Do not edit `.env`** or secrets. Only edit `.env.example` when asked.
- **Do not modify files outside this repo**.
- **Respect existing formatting** (2 spaces in JSON, 4 spaces in JS).
- **Do not introduce new dependencies** without approval.
- **Avoid mass refactors**; keep changes minimal and scoped.
- **No network calls** or package installs unless the user asked.

## 2) Repo Layout (Quick Map)
- **Core runtime**: `src/index.js`, `src/clients/`, `src/handlers/`
- **Commands**: `src/commands/interaction/**` (slash), `src/commands/message/**` (prefix/dev)
- **Events**: `src/events/bot/**`, `src/events/rainlink/**`
- **Utilities**: `src/functions/**`, `src/utils/**`
- **Configuration**: `src/settings/config.js`, `.env.example`
- **Locales**: `src/locales/*.json` (i18n)

## 3) Change Workflow (Strict)
1) **Read the relevant files** before editing.
2) **Propose the minimal change** needed to satisfy the request.
3) **Edit files using `apply_patch`** for single-file changes.
4) **Summarize changes** with exact file paths.
5) **Suggest next steps** (tests, lint) only if relevant.

## 4) I18n/Localization Rules
If you touch user-facing text, **you must use i18n**:
- Use `t(locale, "key.path")` from `src/utils/i18n.js`.
- Use `resolveLocale(client, guildId, userId)` to pick locale.
- Update all locale files in `src/locales/` **consistently**.
- Never hardcode new user-facing strings in commands or events.

Example pattern:
```js
const { t, resolveLocale } = require("../../utils/i18n");
const locale = resolveLocale(client, interaction.guildId, interaction.user.id);
embed.setDescription(t(locale, "commands.play.noResults"));
```

When adding a new key:
1) Add key to **every** locale file (even if values are temporarily English).
2) Keep key names short and grouped (e.g., `errors.*`, `commands.play.*`).

## 5) Command Updates
When editing a command:
- Keep the same command shape (`name`, `description`, `permissions`, `settings`).
- Ensure `permissions` and `settings` logic is unchanged unless requested.
- For slash commands, keep `options` consistent with existing patterns.

## 6) Event Updates
When editing events:
- Avoid changing event flow or side effects.
- Only localize or fix specific user-facing output if requested.
- Keep logging intact (log output stays English).

## 7) Database Schema Rules
If adding fields in schemas:
- Update both schema files and any dependent code in `createData.js`.
- Avoid breaking migrations; use safe defaults.
- Do not remove fields without explicit approval.

## 8) Quality Checklist (Before Final Response)
- Did you avoid touching unrelated files?
- Did you keep formatting consistent?
- Did you update all locale files for new keys?
- Did you avoid destructive commands?
- Did you include file paths in your summary?

## 9) If Something Is Unclear
Ask a direct, concise question. Do **not** guess requirements that affect data storage or bot behavior.

---
**This file is authoritative for Claude Code usage in this repo.**

## Findings (Localization Gaps as of commit ca6fd2d85b5e9f709bf5fe9331c7cb6bf2fdc234)
These items are missing relative to `MULTI_LANGUAGE_SUPPORT.md` guidance:

### Medium
- **Prefix flow not localized**: user-facing strings in the prefix path are still hard-coded despite `src/commands/message/**` being listed as a target. This includes the guard/DM messages and the support button label in `src/events/bot/guild/messageCreate.js`, plus dev commands in:
  - `src/commands/message/dev/ban.js`
  - `src/commands/message/dev/unban.js`
  - `src/commands/message/dev/maintenance.js`
  - `src/commands/message/dev/lavalink.js`
- **Slash interaction guards not localized**: ban/maintenance/permission/support button text in `src/events/bot/guild/interactionCreate.js` is still hard-coded, even though `src/events/bot/**` is a target.
- **Event messages still hard-coded**: explicit target files still contain English text:
  - `src/events/bot/guild/voiceStateUpdate.js` (inactivity disconnect message)
  - `src/events/rainlink/player/trackStuck.js` (stuck/skip messages)
  - `src/events/rainlink/player/playerException.js` (error/skip messages)

### Low
- **Pagination helper strings not localized**: `src/functions/createPage.js` still has `"No data found."` and `"You are not allowed to use this button."` as hard-coded strings.

### Optional
- **Slash command localizations missing**: `name_localizations` / `description_localizations` are not added in command definitions, as suggested in `MULTI_LANGUAGE_SUPPORT.md`.

### Implemented
- Locale files and defaults: `src/locales/*.json`, `DEFAULT_LOCALE` in `.env.example`, and `defaultLocale/supportedLocales` in `src/settings/config.js`.
- Schemas updated: `src/databases/schema/guild.js`, `src/databases/schema/user.js`.
- i18n helper: `src/utils/i18n.js` with `t()` and `resolveLocale()`.
- `/language` command: `src/commands/interaction/setting/language.js`.
- Most slash command responses and permission checks localized; some rainlink events localized.
