const { EmbedBuilder } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "unban",
    aliases: ["unblock"],
    description: "Unban a user",
    category: "dev",
    permissions: {
        bot: [],
        user: [],
    },
    settings: {
        voice: false,
        player: false,
        current: false,
    },
    devOnly: true,
    run: async (client, message, player, args) => {
        const locale = resolveLocale(client, message.guildId, message.author.id);
        const embed = new EmbedBuilder().setColor(client.config.embedColor);
        const user = message.mentions.users.first() || client.users.cache.get(args[0]);

        if (!user) {
            embed.setDescription(t(locale, "dev.unban.userNotFound"));

            return message.reply({ embeds: [embed] });
        }

        let userData = client.data.get(`userData_${user.id}`);

        if (!userData) {
            const noReason = t(locale, "dev.ban.noReason");
            const newUserData = await client.userData.findOneAndUpdate(
                { id: user.id },
                { $set: { ban: { status: false, reason: noReason } } },
                { upsert: true, new: true },
            );
            const { _id, __v, ...data } = newUserData.toObject();

            client.data.set(`userData_${user.id}`, data);

            userData = client.data.get(`userData_${user.id}`);
        }

        if (!userData.ban.status) {
            embed.setDescription(t(locale, "dev.unban.notBanned", { user: user.username }));

            return message.reply({ embeds: [embed] });
        }

        userData.ban = { status: false, reason: null };

        embed.setDescription(t(locale, "dev.unban.unbanned", { user: user.username }));

        return message.reply({ embeds: [embed] });
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
