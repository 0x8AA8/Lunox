const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "leave",
    description: "Leave the voice channel",
    description_localizations: {
        id: "Keluar dari voice channel",
        fr: "Quitter le salon vocal",
        ja: "ボイスチャンネルから退出",
        ko: "음성 채널 나가기",
        "zh-CN": "离开语音频道",
    },
    category: "music",
    permissions: {
        bot: [],
        user: ["ManageGuild"],
    },
    settings: {
        voice: true,
        player: true,
        current: false,
    },
    devOnly: false,
    run: async (client, interaction, player) => {
        const locale = resolveLocale(client, interaction.guildId, interaction.user.id);

        player.destroy();

        const embed = new EmbedBuilder().setColor(client.config.embedColor).setDescription(t(locale, "commands.leave.leaving"));

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
