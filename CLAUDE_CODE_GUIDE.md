# Claude Code Guide (Strict) — Lunox

This file is the **authoritative, detailed guide** for using Claude Code in this repo. It includes strict rules, i18n requirements, and examples aligned with the Lunox codebase.

---

## 1) Non‑Negotiable Rules (Strict)
- **Use PowerShell commands only** (repo is on Windows).
- **Prefer `rg` for search**: `rg "pattern" -g "glob"` or `rg --files`.
- **No destructive commands** (`git reset --hard`, `git checkout --`, `rm -rf`) unless explicitly asked.
- **No network operations** (package installs, API calls) unless asked.
- **Do not edit `.env`** or secrets. Only change `.env.example` if requested.
- **No new dependencies** without explicit approval.
- **Keep changes minimal** and scoped to the request.
- **Respect existing formatting** (JS = 4 spaces, JSON = 2 spaces).
- **Do not edit files outside this repo**.

---

## 2) Repo Map (Quick Reference)
- **Core runtime**: `src/index.js`, `src/clients/`, `src/handlers/`
- **Slash commands**: `src/commands/interaction/**`
- **Prefix/dev commands**: `src/commands/message/**`
- **Events**: `src/events/bot/**`, `src/events/rainlink/**`
- **Utilities**: `src/functions/**`, `src/utils/**`
- **Config**: `src/settings/config.js`, `.env.example`
- **Locales**: `src/locales/*.json`

---

## 3) Change Workflow (Strict)
1) **Read the relevant files** before editing.
2) **Propose the minimal change** needed.
3) **Edit with `apply_patch`** for single-file edits.
4) **Summarize changes** with exact file paths.
5) **Suggest next steps** only if relevant.

---

## 4) I18n / Localization Rules (Mandatory)
If you touch **any user-facing text**, you must use i18n:

- Use `t(locale, "key.path")` from `src/utils/i18n.js`.
- Use `resolveLocale(client, guildId, userId)` to select locale.
- Add any new keys to **every** locale file in `src/locales/`.
- Do **not** introduce hard-coded strings in commands/events for user-facing text.

### Example (Command Response)
```js
const { t, resolveLocale } = require("../../../utils/i18n");

const locale = resolveLocale(client, interaction.guildId, interaction.user.id);
embed.setDescription(t(locale, "commands.play.noResults"));
```

### Example (With Variables)
```js
embed.setDescription(
  t(locale, "commands.volume.set", { volume: 50 })
);
```

### Example (Button Label)
```js
new ButtonBuilder()
  .setLabel(t(locale, "common.supportServer"))
  .setStyle(ButtonStyle.Link)
  .setURL(client.config.supportServerUrl);
```

---

## 5) Slash Command Localizations — How to Code Them
These are **static UI labels** shown by Discord, separate from runtime `t(...)` text.  
Follow this exact flow when adding `name_localizations` / `description_localizations`:

### Step‑by‑step (Required)
1) **Keep the base `name` and `description` in English** (this is the canonical command ID and default text).
2) **Add `name_localizations` + `description_localizations`** at the command level.
3) For each option, **add `name_localizations` + `description_localizations`** under the option itself.
4) **Use Discord locale keys** (e.g., `id`, `fr`, `ja`, `ko`, `zh-CN`), not your runtime locale file names.
5) **Do not change command logic**. This is UI-only metadata.
6) **Re-register commands** (already handled by your loader on `clientReady`).

### Rules (Strict)
- Command names must be **lowercase**, 1–32 chars, no spaces.
- Localized names must follow the same rules.
- The base `name` never changes; localized names only change UI display.
- Runtime text still uses `t(...)`.

### Command‑level localization
```js
module.exports = {
  name: "play",
  description: "Play a song",
  name_localizations: {
    "id": "putar",
    "fr": "jouer"
  },
  description_localizations: {
    "id": "Putar sebuah lagu",
    "fr": "Jouer une chanson"
  },
  options: [ /* ... */ ]
};
```

### Option‑level localization
```js
options: [
  {
    name: "query",
    description: "Provide a song name or url",
    name_localizations: { "id": "kueri", "fr": "requête" },
    description_localizations: {
      "id": "Masukkan judul lagu atau url",
      "fr": "Entrez un titre ou une URL"
    },
    type: 3,
    required: true
  }
]
```

### Locale Code Note
Discord uses **BCP‑47** locale tags. Typical ones:
`en-US`, `id`, `fr`, `ja`, `ko`, `zh-CN`.

Your runtime locale files use `en-US`, `id-ID`, etc.  
That’s fine for runtime i18n, but for slash localizations **use Discord-supported locale keys** (e.g., `id`, `fr`, `ja`, `ko`, `zh-CN`).

---

## 6) Command Editing Rules
When editing a command:
- Keep `name`, `description`, `permissions`, `settings` structure unchanged unless asked.
- If you add new text, add a new i18n key in all locale files.
- Avoid changing behavior or flow unless requested.

---

## 7) Event Editing Rules
When editing events:
- Localize user-facing text only.
- Keep logging in English.
- Don’t alter event flow unless requested.

---

## 8) Schema Changes (if required)
If adding fields:
- Provide safe defaults.
- Update any dependent caching in `src/functions/createData.js`.
- Do not remove fields without explicit approval.

---

## 9) Quality Checklist (Before Final Response)
- Did you avoid unrelated changes?
- Did you keep formatting consistent?
- Did you update **all** locale files for new keys?
- Did you avoid destructive commands?
- Did you provide exact file paths in the summary?

---

## 10) If Something Is Unclear
Ask a direct question. Do **not** guess anything that changes behavior, storage, or security.

---

**This guide is strict and must be followed for all Claude Code work in this repo.**
