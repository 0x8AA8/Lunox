const { EmbedBuilder } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = async (client, player) => {
    if (!player) return;

    if (player.message) player.message.delete().catch((e) => {});

    const channel = await client.channels.cache.get(player.textId);
    const isAutoplayEnabled = client.data.get("autoplay", player.guildId);

    if (isAutoplayEnabled) {
        const track = player.queue.previous[0];
        const getTrack = `https://music.youtube.com/watch?v=${track.identifier}&list=RD${track.identifier}`;
        const result = await client.rainlink.search(getTrack, { requester: track.requester });

        if (!result || !result.tracks || !result.tracks.length) {
            client.data.delete("autoplay", player.guildId);

            return player.destroy();
        }

        const randomTrack = result.tracks[Math.floor(Math.random() * result.tracks.length)];

        player.queue.add(randomTrack);

        if (!player.playing) player.play();
    } else {
        const guildData = client.data.get(`guildData_${player.guildId}`);

        if (guildData && guildData.reconnect.status) return;

        const locale = resolveLocale(client, player.guildId);
        const embed = new EmbedBuilder().setColor(client.config.embedColor).setDescription(t(locale, "events.queueEmpty"));

        if (channel) await channel.send({ embeds: [embed] });

        return player.destroy();
    }
};

/**
 * Project: Lunox
 * Author: adh319
 * Company: EnourDev
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/xhTVzbS5NU
 */
