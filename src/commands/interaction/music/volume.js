const { EmbedBuilder, MessageFlags } = require("discord.js");
const { minVolume, maxVolume } = require("../../../settings/config.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "volume",
    description: "Set the volume",
    description_localizations: {
        id: "Atur volume",
        fr: "Régler le volume",
        ja: "音量を設定",
        ko: "볼륨 설정",
        "zh-CN": "设置音量",
    },
    category: "music",
    options: [
        {
            name: "value",
            description: "Provide volume value",
            description_localizations: {
                id: "Masukkan nilai volume",
                fr: "Fournir une valeur de volume",
                ja: "音量値を入力",
                ko: "볼륨 값 입력",
                "zh-CN": "输入音量值",
            },
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
