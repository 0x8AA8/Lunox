const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "remove",
    description: "Remove a song from the queue",
    description_localizations: {
        id: "Hapus lagu dari antrian",
        fr: "Supprimer une chanson de la file d'attente",
        ja: "キューから曲を削除",
        ko: "대기열에서 노래 제거",
        "zh-CN": "从队列中移除歌曲",
        "en-GB": "Remove a song from the queue",
        "es-ES": "Eliminar una canción de la cola",
        de: "Ein Lied aus der Warteschlange entfernen",
        "pt-BR": "Remover uma música da fila",
        ru: "Удалить песню из очереди",
    },
    category: "music",
    options: [
        {
            name: "position",
            description: "Provide song position",
            description_localizations: {
                id: "Masukkan posisi lagu",
                fr: "Fournir la position de la chanson",
                ja: "曲の位置を入力",
                ko: "노래 위치 입력",
                "zh-CN": "输入歌曲位置",
                "en-GB": "Provide song position",
                "es-ES": "Proporcionar posición de la canción",
                de: "Liedposition angeben",
                "pt-BR": "Fornecer posição da música",
                ru: "Укажите позицию песни",
            },
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
