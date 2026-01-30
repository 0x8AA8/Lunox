const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../utils/i18n");

module.exports = {
    createPage: async (client, response, embed, pages, locale) => {
        let page = 0;
        const userLocale = locale || resolveLocale(client, response.guildId, response.user?.id || response.author?.id);

        const updateEmbed = (pageIndex) => {
            embed.setDescription(pages[pageIndex] || t(userLocale, "common.noDataFound"));
        };

        updateEmbed(page);

        if (pages.length <= 1) {
            return response.reply({ embeds: [embed] });
        } else {
            const pageEmoji = client.emoji.page;
            const buttons = {
                first: new ButtonBuilder().setCustomId("first").setEmoji(pageEmoji.first).setStyle(ButtonStyle.Secondary),
                back: new ButtonBuilder().setCustomId("back").setEmoji(pageEmoji.back).setStyle(ButtonStyle.Secondary),
                close: new ButtonBuilder().setCustomId("close").setEmoji(pageEmoji.close).setStyle(ButtonStyle.Danger),
                next: new ButtonBuilder().setCustomId("next").setEmoji(pageEmoji.next).setStyle(ButtonStyle.Secondary),
                last: new ButtonBuilder().setCustomId("last").setEmoji(pageEmoji.last).setStyle(ButtonStyle.Secondary),
            };
            const row = new ActionRowBuilder().addComponents(Object.values(buttons));
            const msg = await response.reply({ embeds: [embed], components: [row] });
            const collector = msg.createMessageComponentCollector({ time: 60000 });

            collector.on("collect", async (button) => {
                // Prevent other users from interacting with the button
                const responderId = response.user?.id || response.author?.id;
                if (button.user.id !== responderId) {
                    const buttonLocale = resolveLocale(client, response.guildId, button.user.id);
                    const embedDenied = new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(t(buttonLocale, "errors.notAllowedButton"));

                    return button.reply({ embeds: [embedDenied], flags: [MessageFlags.Ephemeral] });
                }

                button.deferUpdate();

                switch (button.customId) {
                    case "first":
                        page = 0;
                        break;
                    case "back":
                        page = page > 0 ? page - 1 : 0;
                        break;
                    case "close":
                        if (msg) await msg.edit({ embeds: [embed], components: [] });

                        return collector.stop();
                    case "next":
                        page = page + 1 < pages.length ? page + 1 : pages.length - 1;
                        break;
                    case "last":
                        page = pages.length - 1;
                        break;
                }

                updateEmbed(page);

                if (msg) await msg.edit({ embeds: [embed], components: [row] });
            });

            collector.on("end", async () => {
                if (msg) await msg.edit({ embeds: [embed], components: [] });
            });
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
