const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "stop",
    description: "Stop the player",
    description_localizations: {
        id: "Hentikan pemutar",
        fr: "Arrêter le lecteur",
        ja: "プレイヤーを停止",
        ko: "플레이어 정지",
        "zh-CN": "停止播放器",
        "en-GB": "Stop the player",
        "es-ES": "Detener el reproductor",
        de: "Player stoppen",
        "pt-BR": "Parar o reprodutor",
        ru: "Остановить плеер",
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

        player.stop();

        const embed = new EmbedBuilder().setColor(client.config.embedColor).setDescription(t(locale, "commands.stop.stopped"));

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
