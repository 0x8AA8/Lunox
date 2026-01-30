const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { createDataGuild, createDataUser } = require("../../../functions/createData.js");
const { permissions } = require("../../../functions/getPermission.js");
const { t, resolveLocale } = require("../../../utils/i18n");
const Logger = require("../../../utils/logger");

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild || message.system || message.webhookId) return;

    await createDataGuild(client, message.guild);
    await createDataUser(client, message.author);

    const userData = client.data.get(`userData_${message.author.id}`);
    const locale = resolveLocale(client, message.guildId, message.author.id);
    const embed = new EmbedBuilder().setColor(client.config.embedColor);
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel(t(locale, "common.supportServer")).setURL(client.config.supportServerUrl).setStyle(ButtonStyle.Link),
    );

    const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
    const botMissingPermissions = [];

    for (const perm of botPermissions) {
        if (!message.channel.permissionsFor(message.guild.members.me).has(perm)) botMissingPermissions.push(perm);
    }

    if (botMissingPermissions.length > 0) {
        const content = t(locale, "errors.botMissingPermissions", { perms: botMissingPermissions.join(", ") });

        const dmChannel = message.author.dmChannel == null ? await message.author.createDM() : message.author.dmChannel;

        return dmChannel.send({ content: content, components: [row] });
    }

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mention)) {
        embed.setDescription(t(locale, "common.useHelpCommand"));

        message.reply({ embeds: [embed] });
    }

    let prefix = client.config.prefix;

    if (message.content.startsWith(prefix) && message.author.id !== client.config.owner) return;
    if (!message.content.startsWith(prefix) && client.config.owner === message.author.id) {
        prefix = "";
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

    if (!prefixRegex.test(message.content)) return;

    const [matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (!cmd.length) return;

    let command = client.prefix.get(cmd);

    if (!command) command = client.prefix.get(client.aliases.get(cmd));
    if (!command) return;

    Logger.info(
        `[PREFIX] [${command.name}] | (${message.author.username})[${message.author.id}] | (${message.guild.name})[${message.guildId}]`,
    );

    if (userData && userData.ban.status) {
        embed.setDescription(t(locale, "errors.userBanned", { reason: userData.ban.reason }));

        return message.reply({ embeds: [embed] });
    }

    const maintenance = client.data.get("maintenance");

    if (maintenance && !client.config.dev.includes(message.author.id)) {
        embed.setDescription(t(locale, "errors.maintenance"));

        return message.reply({ embeds: [embed] });
    }

    let player = client.rainlink.players.get(message.guildId);

    return permissions(client, message, command, embed, player, args);
};

/**
 * Project: Lunox
 * Author: adh319
 * Company: EnourDev
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/xhTVzbS5NU
 */
