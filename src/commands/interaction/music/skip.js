const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "skip",
    description: "Skip the current song",
    description_localizations: {
        id: "Lewati lagu saat ini",
        fr: "Passer la chanson actuelle",
        ja: "現在の曲をスキップ",
        ko: "현재 노래 건너뛰기",
        "zh-CN": "跳过当前歌曲",
        "en-GB": "Skip the current song",
        "es-ES": "Saltar la canción actual",
        de: "Aktuelles Lied überspringen",
        "pt-BR": "Pular a música atual",
        ru: "Пропустить текущую песню",
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

        if (player.queue.isEmpty && !client.data.get("autoplay", player.guildId)) {
            embed.setDescription(t(locale, "commands.skip.emptyQueue"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        player.skip();

        embed.setDescription(t(locale, "commands.skip.skipped"));

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
