const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "seek",
    description: "Seek the current song",
    category: "music",
    options: [
        {
            name: "time",
            description: "Provide time in seconds",
            type: 4,
            min_value: 0,
            required: true,
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
        const time = interaction.options.getInteger("time");

        if (!player.queue.current.isSeekable) {
            embed.setDescription(t(locale, "commands.seek.notSeekable"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        if (time * 1000 > player.queue.current.duration) {
            embed.setDescription(t(locale, "commands.seek.timeExceeds"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        player.seek(time * 1000);

        embed.setDescription(t(locale, "commands.seek.seeked", { time }));

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
