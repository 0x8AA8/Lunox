const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "resume",
    description: "Resume the current paused song",
    description_localizations: {
        id: "Lanjutkan lagu yang dijeda",
        fr: "Reprendre la chanson en pause",
        ja: "一時停止中の曲を再開",
        ko: "일시 정지된 노래 재개",
        "zh-CN": "恢复暂停的歌曲",
        "en-GB": "Resume the current paused song",
        "es-ES": "Reanudar la canción pausada",
        de: "Pausiertes Lied fortsetzen",
        "pt-BR": "Retomar a música pausada",
        ru: "Возобновить приостановленную песню",
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

        if (!player.paused) {
            embed.setDescription(t(locale, "commands.resume.notPaused"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        player.resume();

        embed.setDescription(t(locale, "commands.resume.resumed"));

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
