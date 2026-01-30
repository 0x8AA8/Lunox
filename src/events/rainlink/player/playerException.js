const { EmbedBuilder } = require("discord.js");
const Logger = require("../../../utils/logger");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = async (client, player, data) => {
    if (!player) return;

    const guild = await client.guilds.cache.get(player.guildId);

    Logger.error(`Player got an exception from ${guild.name} (${guild.id})`, data);

    if (player.message) player.message.delete().catch((e) => {});

    const channel = await client.channels.cache.get(player.textId);
    const locale = resolveLocale(client, player.guildId);
    const embed = new EmbedBuilder().setColor(client.config.embedColor);

    if (!player.queue.isEmpty) {
        embed.setDescription(t(locale, "events.playerException"));

        if (channel) await channel.send({ embeds: [embed] });
    } else {
        embed.setDescription(t(locale, "events.playerExceptionEmpty"));

        if (channel) await channel.send({ embeds: [embed] });
    }

    return player.skip();
};

/**
 * Project: Lunox
 * Author: adh319
 * Company: EnourDev
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/xhTVzbS5NU
 */
