const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "remove",
    description: "Remove a song from the queue",
    category: "music",
    options: [
        {
            name: "position",
            description: "Provide song position",
            type: 4,
            min_value: 1,
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

        if (player.queue.isEmpty) {
            embed.setDescription(t(locale, "commands.remove.emptyQueue"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        const position = interaction.options.getInteger("position");

        if (position > player.queue.size) {
            embed.setDescription(t(locale, "commands.remove.invalidPosition"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        player.queue.remove(position - 1);

        embed.setDescription(t(locale, "commands.remove.removed", { position }));

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
