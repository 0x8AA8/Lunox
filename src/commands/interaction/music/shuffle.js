const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "shuffle",
    description: "Shuffle the queue",
    description_localizations: {
        id: "Acak antrian",
        fr: "Mélanger la file d'attente",
        ja: "キューをシャッフル",
        ko: "대기열 섞기",
        "zh-CN": "随机播放队列",
        "en-GB": "Shuffle the queue",
        "es-ES": "Mezclar la cola",
        de: "Warteschlange mischen",
        "pt-BR": "Embaralhar a fila",
        ru: "Перемешать очередь",
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

        if (player.queue.isEmpty) {
            embed.setDescription(t(locale, "commands.shuffle.emptyQueue"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        if (player.queue.length <= 1) {
            embed.setDescription(t(locale, "commands.shuffle.onlyOneSong"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        player.queue.shuffle();

        embed.setDescription(t(locale, "commands.shuffle.shuffled"));

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
