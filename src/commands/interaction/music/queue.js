const { EmbedBuilder, MessageFlags } = require("discord.js");
const { createPage } = require("../../../functions/createPage.js");
const { convertTime } = require("../../../functions/timeFormat.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "queue",
    description: "Show the queue list",
    description_localizations: {
        id: "Tampilkan daftar antrian",
        fr: "Afficher la file d'attente",
        ja: "キューリストを表示",
        ko: "대기열 목록 보기",
        "zh-CN": "显示队列列表",
        "en-GB": "Show the queue list",
        "es-ES": "Mostrar la lista de cola",
        de: "Warteschlange anzeigen",
        "pt-BR": "Mostrar a lista de fila",
        ru: "Показать список очереди",
    },
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
            const trackTitles = formatString(track.title, 30).replace(/ - Topic$/, "") || t(locale, "common.unknownTitle");
            const trackArtists = formatString(track.author, 25).replace(/ - Topic$/, "") || t(locale, "common.unknownAuthor");
            const trackDuration = track.isStream ? t(locale, "common.live") : convertTime(track.duration);

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
