const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "ping",
    description: "Get the bot's ping",
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
