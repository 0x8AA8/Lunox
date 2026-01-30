const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require("discord.js");
const { convertTime } = require("../../../functions/timeFormat.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = async (client, player, track) => {
    if (!player) return;

    const locale = resolveLocale(client, player.guildId);
    const formatString = (str, maxLength) => (str.length > maxLength ? str.substr(0, maxLength - 3) + "..." : str);
    const trackTitle = formatString(track.title || "Unknown", 30).replace(/ - Topic$/, "");
    const trackAuthor = formatString(track.author || "Unknown", 25).replace(/ - Topic$/, "");
    const trackDuration = track.isStream ? "LIVE" : convertTime(track.duration);
    const playerEmoji = client.emoji.player;

    const trackMsg = new EmbedBuilder()
        .setAuthor({ name: player.paused ? t(locale, "player.songPaused") : t(locale, "player.nowPlaying"), iconURL: client.user.displayAvatarURL() })
        .setColor(client.config.embedColor)
        .setThumbnail(track.artworkUrl)
        .setDescription(`**[${trackTitle} - ${trackAuthor}](${track.uri})**`)
        .setFields(
            { name: t(locale, "player.source"), value: `${capitalize(track.source)}`, inline: true },
            { name: t(locale, "player.duration"), value: `\`${trackDuration}\``, inline: true },
            { name: t(locale, "player.requestedBy"), value: `${track.requester}`, inline: true },
        );

    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("pause")
            .setEmoji(player.paused ? playerEmoji.resume : playerEmoji.pause)
            .setStyle(player.paused ? ButtonStyle.Primary : ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("voldown").setEmoji(playerEmoji.voldown).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("volup").setEmoji(playerEmoji.volup).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("loop").setEmoji(playerEmoji.loop).setStyle(ButtonStyle.Secondary),
    );

    const button2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("shuffle").setEmoji(playerEmoji.shuffle).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("prev").setEmoji(playerEmoji.previous).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("skip").setEmoji(playerEmoji.skip).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("stop").setEmoji(playerEmoji.stop).setStyle(ButtonStyle.Danger),
    );

    const nplaying = await client.channels.cache.get(player.textId).send({ embeds: [trackMsg], components: [button, button2] });
    player.message = nplaying;

    const embed = new EmbedBuilder().setColor(client.config.embedColor);
    const collector = nplaying.createMessageComponentCollector();

    collector.on("collect", async (message) => {
        if (!player) return collector.stop();

        const userLocale = resolveLocale(client, player.guildId, message.user.id);

        // Prevent user from using buttons if they are not in the same voice channel
        if (!message.member.voice.channel || player.voiceId !== message.member.voice.channelId) {
            embed.setDescription(t(userLocale, "errors.sameVoiceChannel"));

            return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        // Prevent user from using buttons if they are not the requester
        if (message.user.id !== track.requester.id) {
            embed.setDescription(t(userLocale, "errors.onlyRequester"));

            return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        switch (message.customId) {
            case "pause":
                if (!player.paused) {
                    message.deferUpdate();

                    player.pause();

                    button.components[0].setEmoji(playerEmoji.resume).setStyle(ButtonStyle.Primary);
                    trackMsg.setAuthor({ name: t(locale, "player.songPaused"), iconURL: client.user.displayAvatarURL() });
                } else {
                    message.deferUpdate();

                    player.resume();

                    button.components[0].setEmoji(playerEmoji.pause).setStyle(ButtonStyle.Secondary);
                    trackMsg.setAuthor({ name: t(locale, "player.nowPlaying"), iconURL: client.user.displayAvatarURL() });
                }

                await nplaying.edit({ embeds: [trackMsg], components: [button, button2] });
                break;
            case "prev":
                if (!player.queue.previous.length) {
                    embed.setDescription(t(userLocale, "commands.previous.notFound"));

                    return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
                }

                message.deferUpdate();

                player.previous();
                break;
            case "skip":
                if (player.queue.isEmpty && !client.data.get("autoplay", player.guildId)) {
                    embed.setDescription(t(userLocale, "commands.skip.emptyQueue"));

                    return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
                }

                message.deferUpdate();

                player.skip();
                break;
            case "loop":
                switch (player.loop) {
                    case "none":
                        embed.setDescription(t(userLocale, "commands.loop.song"));

                        player.setLoop("song");
                        break;
                    case "song":
                        embed.setDescription(t(userLocale, "commands.loop.queue"));

                        player.setLoop("queue");
                        break;
                    case "queue":
                        embed.setDescription(t(userLocale, "commands.loop.off"));

                        player.setLoop("none");
                        break;
                }

                return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            case "shuffle":
                if (player.queue.isEmpty) {
                    embed.setDescription(t(userLocale, "commands.shuffle.emptyQueue"));

                    return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
                }

                player.queue.shuffle();

                embed.setDescription(t(userLocale, "commands.shuffle.queueShuffled"));

                return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            case "voldown":
                if (player.volume <= client.config.minVolume) {
                    embed.setDescription(t(userLocale, "commands.volume.minVolume", { min: client.config.minVolume }));

                    return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
                }

                const volumeDown = player.volume - 10;

                player.setVolume(volumeDown);

                embed.setDescription(t(userLocale, "commands.volume.set", { volume: volumeDown }));

                return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            case "volup":
                if (player.volume >= client.config.maxVolume) {
                    embed.setDescription(t(userLocale, "commands.volume.maxVolume", { max: client.config.maxVolume }));

                    return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
                }

                const volumeUp = player.volume + 10;

                player.setVolume(volumeUp);

                embed.setDescription(t(userLocale, "commands.volume.set", { volume: volumeUp }));

                return message.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            case "stop":
                message.deferUpdate();

                player.stop();
                break;
        }
    });
};

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Project: Lunox
 * Author: adh319
 * Company: EnourDev
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/xhTVzbS5NU
 */
