const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "loop",
    description: "Toggle loop mode",
    description_localizations: {
        id: "Aktifkan mode loop",
        fr: "Basculer le mode boucle",
        ja: "ループモードを切り替え",
        ko: "반복 모드 전환",
        "zh-CN": "切换循环模式",
        "en-GB": "Toggle loop mode",
        "es-ES": "Alternar modo de repetición",
        de: "Wiederholungsmodus umschalten",
        "pt-BR": "Alternar modo de repetição",
        ru: "Переключить режим повтора",
    },
    category: "music",
    options: [
        {
            name: "mode",
            description: "Set loop mode",
            description_localizations: {
                id: "Atur mode loop",
                fr: "Définir le mode boucle",
                ja: "ループモードを設定",
                ko: "반복 모드 설정",
                "zh-CN": "设置循环模式",
                "en-GB": "Set loop mode",
                "es-ES": "Establecer modo de repetición",
                de: "Wiederholungsmodus einstellen",
                "pt-BR": "Definir modo de repetição",
                ru: "Установить режим повтора",
            },
            type: 3,
            required: true,
            choices: [
                { name: "off", value: "none" },
                { name: "song", value: "song" },
                { name: "queue", value: "queue" },
            ],
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
        const mode = interaction.options.getString("mode");

        switch (mode) {
            case "none":
                embed.setDescription(t(locale, "commands.loop.off"));
                break;
            case "song":
                embed.setDescription(t(locale, "commands.loop.song"));
                break;
            case "queue":
                embed.setDescription(t(locale, "commands.loop.queue"));
                break;
        }

        player.setLoop(mode);

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
