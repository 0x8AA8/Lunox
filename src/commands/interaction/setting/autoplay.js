const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "autoplay",
    description: "Toggle autoplay mode",
    category: "setting",
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
        const track = player.queue.isEmpty ? player.queue.current : player.queue[player.queue.size - 1];

        if (!isYoutube(track)) {
            const status = player.queue.isEmpty ? t(locale, "commands.autoplay.currentNotSupported") : t(locale, "commands.autoplay.lastNotSupported");
            embed.setDescription(t(locale, "commands.autoplay.notSupported", { status }));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        const autoplay = client.data.get("autoplay", player.guildId);

        if (autoplay) {
            client.data.delete("autoplay", player.guildId);

            embed.setDescription(t(locale, "commands.autoplay.disabled"));
        } else {
            client.data.set("autoplay", player.guildId);

            embed.setDescription(t(locale, "commands.autoplay.enabled"));
        }

        return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
    },
};

function isYoutube(track) {
    return track?.source === "youtube";
}

/**
 * Project: Lunox
 * Author: adh319
 * Company: EnourDev
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/xhTVzbS5NU
 */
