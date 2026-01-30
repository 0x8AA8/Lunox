const fs = require("node:fs");
const path = require("node:path");
const Logger = require("./logger");

const cache = new Map();

function loadLocale(locale) {
    if (cache.has(locale)) return cache.get(locale);

    const file = path.join(__dirname, "..", "locales", `${locale}.json`);

    try {
        const data = JSON.parse(fs.readFileSync(file, "utf8"));
        cache.set(locale, data);
        return data;
    } catch (error) {
        Logger.warn(`Failed to load locale ${locale}, falling back to en-US`);
        return null;
    }
}

function getValue(obj, key) {
    return key.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
}

/**
 * Translate a key to the specified locale
 * @param {string} locale - The locale to translate to (e.g., "en-US", "id-ID")
 * @param {string} key - The translation key (e.g., "commands.play.noResults")
 * @param {object} vars - Variables to interpolate (e.g., { title: "Song Name" })
 * @param {string} fallbackLocale - Fallback locale if key not found
 * @returns {string} The translated string
 */
function t(locale, key, vars = {}, fallbackLocale = "en-US") {
    const dict = loadLocale(locale);
    let value = dict ? getValue(dict, key) : null;

    if (value == null && fallbackLocale && locale !== fallbackLocale) {
        const fallbackDict = loadLocale(fallbackLocale);
        value = fallbackDict ? getValue(fallbackDict, key) : null;
    }

    if (value == null) {
        Logger.warn(`Missing i18n key: ${key} for locale ${locale}`);
        return key;
    }

    return String(value).replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : `{${k}}`));
}

/**
 * Resolve the locale for a guild/user
 * @param {object} client - The Discord client
 * @param {string} guildId - The guild ID
 * @param {string} userId - The user ID (optional)
 * @returns {string} The resolved locale
 */
function resolveLocale(client, guildId, userId = null) {
    const userData = userId ? client.data.get(`userData_${userId}`) : null;
    const guildData = client.data.get(`guildData_${guildId}`);

    return userData?.locale || guildData?.locale || client.config.defaultLocale || "en-US";
}

/**
 * Get list of supported locales
 * @returns {string[]} Array of supported locale codes
 */
function getSupportedLocales() {
    const localesDir = path.join(__dirname, "..", "locales");
    const files = fs.readdirSync(localesDir).filter((file) => file.endsWith(".json"));
    return files.map((file) => file.replace(".json", ""));
}

module.exports = { t, resolveLocale, getSupportedLocales };

/**
 * Project: Lunox
 * Author: adh319
 * Company: EnourDev
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/xhTVzbS5NU
 */
