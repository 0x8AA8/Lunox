const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "seek",
    description: "Seek the current song",
    description_localizations: {
        id: "Loncat ke waktu tertentu",
        fr: "Avancer dans la chanson actuelle",
        ja: "現在の曲をシーク",
        ko: "현재 노래 탐색",
        "zh-CN": "跳转到指定时间",
        "en-GB": "Seek the current song",
        "es-ES": "Buscar en la canción actual",
        de: "Im aktuellen Lied spulen",
        "pt-BR": "Avançar na música atual",
        ru: "Перемотать текущую песню",
    },
    category: "music",
    options: [
        {
            name: "time",
            description: "Provide time in seconds",
            description_localizations: {
                id: "Masukkan waktu dalam detik",
                fr: "Fournir le temps en secondes",
                ja: "秒数を入力",
                ko: "초 단위로 시간 입력",
                "zh-CN": "输入秒数",
                "en-GB": "Provide time in seconds",
                "es-ES": "Proporcionar tiempo en segundos",
                de: "Zeit in Sekunden angeben",
                "pt-BR": "Fornecer tempo em segundos",
                ru: "Укажите время в секундах",
            },
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
