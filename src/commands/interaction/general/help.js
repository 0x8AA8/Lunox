const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { readdirSync } = require("fs");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "help",
    description: "Get a list of commands",
    category: "general",
    permissions: {
        bot: [],
        user: [],
    },
    settings: {
        voice: false,
        player: false,
        current: false,
    },
    devOnly: false,
    run: async (client, interaction, player) => {
        const locale = resolveLocale(client, interaction.guildId, interaction.user.id);
        const embed = new EmbedBuilder().setColor(client.config.embedColor);
        const categories = readdirSync("./src/commands/interaction/");

        const categoryPromises = categories.map(async (category) => {
            const commands = client.slash.filter((c) => c.category === category);

            const slashCommandData = await Promise.all(
                commands.map(async (c) => {
                    return `\`${c.name}\``;
                }),
            );

            const categoryName = t(locale, `categories.${category}`);

            return embed.addFields({ name: `\`❯\`  ${toOppositeCase(categoryName)}`, value: `${slashCommandData.join(", ")}` });
        });

        await Promise.all(categoryPromises);

        embed
            .setAuthor({ name: t(locale, "commands.help.authorTitle", { bot: client.user.username }), iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(t(locale, "commands.help.intro", { user: interaction.member, bot: client.user }))
            .setFooter({
                text: `© ${client.user.username} | ${t(locale, "commands.help.footer", { count: client.slash.size })}`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel(t(locale, "common.supportServer")).setURL(client.config.supportServerUrl).setStyle(ButtonStyle.Link),
        );

        return interaction.reply({ embeds: [embed], components: [row] });
    },
};

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1).toLowerCase();
}

/**
 * Project: Lunox
 * Author: adh319
 * Company: EnourDev
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/xhTVzbS5NU
 */
