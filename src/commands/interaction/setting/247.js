const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "247",
    description: "Toggle 247 mode",
    category: "setting",
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
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const guildData = client.data.get(`guildData_${interaction.guildId}`);

        guildData.reconnect.status = !guildData.reconnect.status;
        guildData.reconnect.text = player.textId || interaction.channelId;
        guildData.reconnect.voice = player.voiceId || interaction.member.voice.channelId;

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setDescription(guildData.reconnect.status ? t(locale, "commands.247.enabled") : t(locale, "commands.247.disabled"));

        return interaction.editReply({ embeds: [embed] });
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
