const { EmbedBuilder, MessageFlags } = require("discord.js");
const { convertTime } = require("../../../functions/timeFormat.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "play",
    description: "Play a song",
    description_localizations: {
        id: "Putar sebuah lagu",
        fr: "Jouer une chanson",
        ja: "曲を再生",
        ko: "노래 재생",
        "zh-CN": "播放歌曲",
        "en-GB": "Play a song",
        "es-ES": "Reproducir una canción",
        de: "Ein Lied abspielen",
        "pt-BR": "Tocar uma música",
        ru: "Воспроизвести песню",
    },
    category: "music",
    options: [
        {
            name: "query",
            description: "Provide a song name or url",
            description_localizations: {
                id: "Masukkan nama lagu atau url",
                fr: "Fournir un nom de chanson ou une URL",
                ja: "曲名またはURLを入力",
                ko: "노래 이름 또는 URL 입력",
                "zh-CN": "输入歌曲名称或链接",
                "en-GB": "Provide a song name or URL",
                "es-ES": "Proporciona un nombre de canción o URL",
                de: "Liedname oder URL eingeben",
                "pt-BR": "Forneça um nome de música ou URL",
                ru: "Укажите название песни или URL",
            },
            type: 3,
            required: true,
        },
    ],
    permissions: {
        bot: ["Speak", "Connect"],
        user: ["Speak", "Connect"],
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

        if (player && player.voiceId !== interaction.member.voice.channelId) {
            embed.setDescription(t(locale, "errors.sameVoiceChannel"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        const query = interaction.options.getString("query");
        const result = await client.rainlink.search(query, { requester: interaction.member, sourceID: client.config.lavalinkSource });

        if (result.type === "EMPTY" || result.type === "ERROR" || !result.tracks.length) {
            embed.setDescription(t(locale, "commands.play.noResults"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        if (!player) {
            player = await client.rainlink.create({
                guildId: interaction.guildId,
                textId: interaction.channelId,
                voiceId: interaction.member.voice.channelId,
                shardId: interaction.guild.shardId,
                volume: client.config.defaultVolume,
                deaf: true,
            });
        }

        if (result.type === "PLAYLIST") {
            for (const track of result.tracks) player.queue.add(track);

            embed.setDescription(t(locale, "commands.play.addedPlaylist", { name: result.playlistName, url: query, count: result.tracks.length }));
        } else {
            const track = result.tracks[0];
            const trackTitle = formatString(track.title, 30).replace(/ - Topic$/, "") || t(locale, "common.unknown");
            const trackAuthor = formatString(track.author, 25).replace(/ - Topic$/, "") || t(locale, "common.unknown");

            player.queue.add(track);

            embed.setDescription(`Added **[${trackTitle} - ${trackAuthor}](${track.uri})** - \`${convertTime(track.duration)}\`.`);
        }

        await interaction.reply({ embeds: [embed] });

        if (!player.playing) return player.play();
    },
};

function formatString(str, maxLength) {
    return str.length > maxLength ? str.substr(0, maxLength - 3) + "..." : str;
}

/**
 * Project: Lunox
 * Author: adh319
 * Company: EnourDev
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/xhTVzbS5NU
 */
