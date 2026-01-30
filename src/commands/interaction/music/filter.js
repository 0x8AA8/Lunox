const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "filter",
    description: "Set the filter",
    description_localizations: {
        id: "Atur filter",
        fr: "Définir le filtre",
        ja: "フィルターを設定",
        ko: "필터 설정",
        "zh-CN": "设置滤镜",
        "en-GB": "Set the filter",
        "es-ES": "Establecer el filtro",
        de: "Filter einstellen",
        "pt-BR": "Definir o filtro",
        ru: "Установить фильтр",
    },
    category: "music",
    options: [
        {
            name: "mode",
            description: "Choose a filter",
            description_localizations: {
                id: "Pilih filter",
                fr: "Choisir un filtre",
                ja: "フィルターを選択",
                ko: "필터 선택",
                "zh-CN": "选择滤镜",
                "en-GB": "Choose a filter",
                "es-ES": "Elegir un filtro",
                de: "Filter auswählen",
                "pt-BR": "Escolher um filtro",
                ru: "Выбрать фильтр",
            },
            type: 3,
            required: true,
            choices: [
                { name: "8d", value: "eightD" },
                { name: "bass", value: "bass" },
                { name: "chipmunk", value: "chimpunk" },
                { name: "clear", value: "clear" },
                { name: "earrape", value: "earrape" },
                { name: "electronic", value: "electronic" },
                { name: "karaoke", value: "karaoke" },
                { name: "nightcore", value: "nightcore" },
                { name: "pitch", value: "pitch" },
                { name: "slow", value: "slow" },
                { name: "soft", value: "soft" },
                { name: "tremolo", value: "tremolo" },
                { name: "treblebass", value: "treblebass" },
                { name: "vaporwave", value: "vaporwave" },
                { name: "vibrato", value: "vibrato" },
                // For additional options, check the official RainlinkFilter documentation here: https://docs-rainlinkjs.vercel.app/classes/RainlinkFilter.html#set
            ],
        },
    ],
    permissions: {
        bot: [],
        user: [],
    },
    settings: {
        voice: true,
        player: true,
        current: true,
    },
    devOnly: false,
    run: async (client, interaction, player) => {
        const locale = resolveLocale(client, interaction.guildId, interaction.user.id);
        const embed = new EmbedBuilder().setColor(client.config.embedColor);
        const mode = interaction.options.getString("mode");
        const currentVolume = player.volume;

        player.filter.set(mode);

        if (mode === "clear") {
            embed.setDescription(t(locale, "commands.filter.cleared"));
        } else {
            embed.setDescription(t(locale, "commands.filter.set", { filter: mode }));
        }

        player.setVolume(currentVolume);

        return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
    },
};

/**
 * Project: Lunox
 * Author: adh319
 * Company: EnourDev
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/xhTVzbS5NU
 */
