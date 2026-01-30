const { EmbedBuilder, MessageFlags } = require("discord.js");
const { minVolume, maxVolume } = require("../../../settings/config.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "volume",
    description: "Set the volume",
    category: "music",
    options: [
        {
            name: "value",
            description: "Provide volume value",
            type: 4,
            min_value: minVolume,
            max_value: maxVolume,
            required: false,
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
        const value = interaction.options.getInteger("value");

        if (!value) {
            embed.setDescription(t(locale, "commands.volume.current", { volume: player.volume }));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        player.setVolume(value);

        embed.setDescription(t(locale, "commands.volume.set", { volume: value }));

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
