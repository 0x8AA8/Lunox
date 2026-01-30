const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "join",
    description: "Join the voice channel",
    description_localizations: {
        id: "Bergabung ke voice channel",
        fr: "Rejoindre le salon vocal",
        ja: "ボイスチャンネルに参加",
        ko: "음성 채널 참가",
        "zh-CN": "加入语音频道",
        "en-GB": "Join the voice channel",
        "es-ES": "Unirse al canal de voz",
        de: "Sprachkanal beitreten",
        "pt-BR": "Entrar no canal de voz",
        ru: "Присоединиться к голосовому каналу",
    },
    category: "music",
    permissions: {
        bot: [],
        user: [],
    },
    settings: {
        voice: true,
        player: false,
        current: false,
    },
    devOnly: false,
    run: async (client, interaction, player) => {
        const locale = resolveLocale(client, interaction.guildId, interaction.user.id);
        const embed = new EmbedBuilder().setColor(client.config.embedColor);

        if (player) {
            embed.setDescription(t(locale, "commands.join.alreadyJoined"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        } else {
            player = await client.rainlink.create({
                guildId: interaction.guildId,
                textId: interaction.channelId,
                voiceId: interaction.member.voice.channelId,
                shardId: interaction.guild.shardId,
                volume: client.config.defaultVolume,
                deaf: true,
            });

            embed.setDescription(t(locale, "commands.join.joined", { channel: interaction.member.voice.channel }));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }
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
