# Multi-language Support (i18n) for Lunox

This document is a detailed, practical guide to add localization to Lunox. It includes a recommended file structure, schema changes, helper utilities, and code snippets tailored to the current codebase layout.

## Summary
- Introduce locale files under `src/locales/`
- Add locale fields to guild/user data
- Add a small `i18n` helper
- Replace hard-coded user-facing strings with translation keys
- (Optional) add a `/language` command to let guilds/users choose a language

## Goals
- Localize user-facing text: embeds, errors, buttons, command responses.
- Support per-guild locale with optional per-user override.
- Provide a default locale and a safe fallback.
- Keep the code changes small and consistent with the current architecture.

## Non-goals
- Translating log output (keep logs English by default).
- Changing core command flow or architecture.

## Where Text Lives Today
Most user-facing strings are in:
- `src/commands/interaction/**`
- `src/commands/message/**`
- `src/events/bot/**`
- `src/events/rainlink/**`
- `src/functions/getPermission.js`
- `src/functions/createPage.js`

These are the first places to update.

## Recommended Locale Structure
Create locale files under `src/locales/`:

```
src/locales/
  en-US.json
  id-ID.json
```

Example `src/locales/en-US.json`:

```json
{
  "common": {
    "supportServer": "Support Server",
    "noData": "No data found.",
    "yes": "Yes",
    "no": "No"
  },
  "errors": {
    "notInVoice": "You need to join a voice channel first.",
    "noPermission": "You don't have permission `{perm}` to execute this command.",
    "botPermission": "The bot doesn't have permission `{perm}` to execute this command."
  },
  "commands": {
    "help": {
      "description": "Get a list of commands",
      "intro": "Hello **{user}**, I'm **{bot}**. Use the commands below:"
    },
    "play": {
      "description": "Play a song",
      "noResults": "No results found for your query.",
      "addedTrack": "Added **[{title} - {author}]({url})** - `{duration}`.",
      "addedPlaylist": "Added **[{name}]({url})** - `{count}` songs to the queue."
    }
  }
}
```

Keep keys stable and organized by area. Add new keys as features evolve.

## Locale Resolution Strategy
Recommended order:
1) User locale (if you choose to store it)
2) Guild locale
3) Default locale (config or env)

Suggested additions:
- `src/databases/schema/guild.js`: add `locale` with default `en-US`
- `src/databases/schema/user.js`: optional `locale`
- `src/settings/config.js`: add `defaultLocale` and optional `supportedLocales`

### Example: Guild Schema Update

```js
const createGuild = mongoose.Schema({
  id: { type: String, required: true },
  locale: { type: String, default: "en-US" },
  reconnect: {
    status: { type: Boolean, default: false },
    text: { type: String, default: null },
    voice: { type: String, default: null }
  }
});
```

### Example: User Schema Update (Optional)

```js
const createUser = mongoose.Schema({
  id: { type: String, required: true },
  locale: { type: String, default: null },
  ban: {
    status: { type: Boolean, default: false },
    reason: { type: String, default: null }
  }
});
```

## Configuration
Add a default locale to `.env` and `src/settings/config.js`.

`.env`:
```
DEFAULT_LOCALE = en-US
```

`src/settings/config.js`:

```js
defaultLocale: process.env.DEFAULT_LOCALE || "en-US",
supportedLocales: ["en-US", "id-ID"]
```

## Translation Helper
Add a helper `src/utils/i18n.js`:

```js
const fs = require("node:fs");
const path = require("node:path");

const cache = new Map();

function loadLocale(locale) {
  if (cache.has(locale)) return cache.get(locale);
  const file = path.join(__dirname, "..", "locales", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  cache.set(locale, data);
  return data;
}

function getValue(obj, key) {
  return key.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
}

function t(locale, key, vars = {}, fallbackLocale = "en-US") {
  const dict = loadLocale(locale);
  let value = getValue(dict, key);
  if (value == null && fallbackLocale) value = getValue(loadLocale(fallbackLocale), key);
  if (value == null) return key;
  return String(value).replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : `{${k}}`));
}

module.exports = { t };
```

## Locale Picker Helper (Optional)
A small helper for consistent locale resolution:

```js
function resolveLocale(client, guildId, userId) {
  const guildData = client.data.get(`guildData_${guildId}`);
  const userData = userId ? client.data.get(`userData_${userId}`) : null;
  return userData?.locale || guildData?.locale || client.config.defaultLocale;
}
```

## Wiring Into Commands and Events
Replace hard-coded strings with `t(locale, key, vars)`.

### Example: `getPermission.js`

```js
const { t } = require("../utils/i18n");

const locale = resolveLocale(client, response.guildId, response.member?.id);
embed.setDescription(t(locale, "errors.notInVoice"));
```

### Example: Buttons and Labels

```js
new ButtonBuilder()
  .setLabel(t(locale, "common.supportServer"))
  .setStyle(ButtonStyle.Link)
  .setURL(client.config.supportServerUrl);
```

## Practical Conversion Example
Converting `src/commands/interaction/music/play.js`:

Before:
```js
embed.setDescription(`No results found for your query.`);
```

After:
```js
const { t } = require("../../../utils/i18n");
const locale = resolveLocale(client, interaction.guildId, interaction.user.id);
embed.setDescription(t(locale, "commands.play.noResults"));
```

Variables:
```js
embed.setDescription(
  t(locale, "commands.play.addedTrack", {
    title: trackTitle,
    author: trackAuthor,
    url: track.uri,
    duration: convertTime(track.duration)
  })
);
```

## Slash Command Localization
Discord supports localized names and descriptions at the definition level.

```js
module.exports = {
  name: "play",
  description: "Play a song",
  name_localizations: { "id": "putar" },
  description_localizations: { "id": "Putar sebuah lagu" },
  options: [
    {
      name: "query",
      description: "Provide a song name or url",
      name_localizations: { "id": "kueri" },
      description_localizations: { "id": "Masukkan judul lagu atau url" },
      type: 3,
      required: true
    }
  ]
};
```

Note: These localizations are static in the command definition. Runtime text still uses `t(...)`.

## Add a /language Command (Example)
Add a new file: `src/commands/interaction/setting/language.js`.

```js
const { EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  name: "language",
  description: "Set the server language",
  category: "setting",
  options: [
    {
      name: "locale",
      description: "Choose a language",
      type: 3,
      required: true,
      choices: [
        { name: "English (US)", value: "en-US" },
        { name: "Bahasa Indonesia", value: "id-ID" }
      ]
    }
  ],
  permissions: { bot: [], user: ["ManageGuild"] },
  settings: { voice: false, player: false, current: false },
  devOnly: false,
  run: async (client, interaction) => {
    const locale = interaction.options.getString("locale");
    const embed = new EmbedBuilder().setColor(client.config.embedColor);

    await client.guildData.findOneAndUpdate(
      { id: interaction.guildId },
      { $set: { locale } },
      { upsert: true, new: true }
    );

    const data = client.data.get(`guildData_${interaction.guildId}`) || {};
    data.locale = locale;
    client.data.set(`guildData_${interaction.guildId}`, data);

    embed.setDescription(`Language updated to \`${locale}\`.`);
    return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
  }
};
```

## Migration Notes
Existing guilds will get the default locale automatically through schema defaults.
If you add user locale, make sure `createDataUser` stores it in `client.data` once created.

## Translation Key Guidelines
- Prefix by area: `errors.*`, `common.*`, `commands.<name>.*`
- Keep keys short and stable
- Use `{vars}` for dynamic values

## Optional: Missing Key Detection
During development, you can log missing keys:

```js
if (value == null) {
  Logger.warn(`Missing i18n key: ${key} for locale ${locale}`);
  return key;
}
```

## Optional: Caching Strategy
The helper above caches locale JSON in memory for fast lookups. If you edit locale files in production, restart the bot to reload.

## Quick Checklist
1) Add `src/locales/en-US.json`
2) Add `defaultLocale` to config and `.env`
3) Update guild/user schemas
4) Add `src/utils/i18n.js`
5) Replace user-facing strings with `t(...)`
6) Add `/language` command (optional)
7) Add translations for new keys

## Testing Suggestions
- Start the bot with `DEFAULT_LOCALE=en-US` and confirm existing text matches.
- Switch a guild to another locale and validate:
  - Slash command replies
  - Prefix command replies
  - Buttons and embeds
  - Error messages
- Remove a key and verify fallback behavior.
