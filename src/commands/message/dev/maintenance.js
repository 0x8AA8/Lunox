const { EmbedBuilder } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "maintenance",
    aliases: ["devmode"],
    description: "Toggle maintenance mode",
    category: "dev",
    permissions: {
        bot: [],
        user: [],
    },
    settings: {
        voice: false,
        player: false,
        current: false,
    },
    devOnly: true,
    run: async (client, message, player, args) => {
        const locale = resolveLocale(client, message.guildId, message.author.id);
        const embed = new EmbedBuilder().setColor(client.config.embedColor);
        const maintenance = client.data.get("maintenance");

        if (maintenance) {
            client.data.set("maintenance", false);

            embed.setDescription(t(locale, "dev.maintenance.disabled"));
        } else {
            client.data.set("maintenance", true);

            embed.setDescription(t(locale, "dev.maintenance.enabled"));
        }

        return message.reply({ embeds: [embed] });
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
