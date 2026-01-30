const { EmbedBuilder, MessageFlags } = require("discord.js");
const { createPage } = require("../../../functions/createPage.js");
const { convertTime } = require("../../../functions/timeFormat.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "queue",
    description: "Show the queue list",
    category: "music",
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
        const formatString = (str, maxLength) => (str.length > maxLength ? str.substr(0, maxLength - 3) + "..." : str);

        if (player.queue.isEmpty) {
            embed.setDescription(t(locale, "commands.queue.empty"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        const queueList = player.queue.map((track, index) => {
            const trackUrl = track.uri;
            const trackTitles = formatString(track.title, 30).replace(/ - Topic$/, "") || "Unknown Title";
            const trackArtists = formatString(track.author, 25).replace(/ - Topic$/, "") || "Unknown Author";
            const trackDuration = track.isStream ? "LIVE" : convertTime(track.duration);

            return `\`${index + 1}.\` **[${trackTitles} - ${trackArtists}](${trackUrl})**  •  \`${trackDuration}\``;
        });

        embed
            .setAuthor({ name: t(locale, "player.queueList"), iconURL: client.user.displayAvatarURL() })
            .setColor(client.config.embedColor)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({
                text: `${t(locale, "player.totalSongs", { count: player.queue.size })}  •  ${t(locale, "player.totalDuration", { duration: convertTime(player.queue.duration) })}`,
                iconURL: client.user.displayAvatarURL(),
            });

        const pages = lodash.chunk(queueList, 10).map((s) => s.join("\n"));

        return createPage(client, interaction, embed, pages);
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
