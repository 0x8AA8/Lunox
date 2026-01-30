const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "ping",
    description: "Get the bot's ping",
    description_localizations: {
        id: "Dapatkan ping bot",
        fr: "Obtenir le ping du bot",
        ja: "ボットのping値を取得",
        ko: "봇 핑 확인",
        "zh-CN": "获取机器人延迟",
        "en-GB": "Get the bot's ping",
        "es-ES": "Obtener el ping del bot",
        de: "Ping des Bots anzeigen",
        "pt-BR": "Obter o ping do bot",
        ru: "Получить пинг бота",
    },
    category: "general",
    permissions: {
        bot: [],
        user: [],
    },
    settings: {
        voice: false,
        player: false,
        current: false,
    },
    devOnly: false,
    run: async (client, interaction, player) => {
        const locale = resolveLocale(client, interaction.guildId, interaction.user.id);
        const embed = new EmbedBuilder().setColor(client.config.embedColor).setDescription(`🏓 ${t(locale, "commands.ping.response", { ms: Math.round(client.ws.ping) })}`);

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
