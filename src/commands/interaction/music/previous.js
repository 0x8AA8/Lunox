const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "previous",
    description: "Play the previous song",
    description_localizations: {
        id: "Putar lagu sebelumnya",
        fr: "Jouer la chanson précédente",
        ja: "前の曲を再生",
        ko: "이전 노래 재생",
        "zh-CN": "播放上一首歌曲",
        "en-GB": "Play the previous song",
        "es-ES": "Reproducir la canción anterior",
        de: "Vorheriges Lied abspielen",
        "pt-BR": "Tocar a música anterior",
        ru: "Воспроизвести предыдущую песню",
    },
    category: "music",
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

        if (!player.queue.previous) {
            embed.setDescription(t(locale, "commands.previous.notFound"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        player.previous();

        embed.setDescription(t(locale, "commands.previous.playing"));

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
