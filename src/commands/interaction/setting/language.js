const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "language",
    description: "Set the server language",
    category: "setting",
    options: [
        {
            name: "locale",
            description: "Choose a language",
            type: 3,
            required: true,
            choices: [
                { name: "English (US)", value: "en-US" },
                { name: "Bahasa Indonesia", value: "id-ID" },
                { name: "日本語", value: "ja-JP" },
                { name: "한국어", value: "ko-KR" },
                { name: "简体中文", value: "zh-CN" },
                { name: "Français", value: "fr-FR" },
            ],
        },
    ],
    permissions: {
        bot: [],
        user: ["ManageGuild"],
    },
    settings: {
        voice: false,
        player: false,
        current: false,
    },
    devOnly: false,
    run: async (client, interaction) => {
        const newLocale = interaction.options.getString("locale");
        const embed = new EmbedBuilder().setColor(client.config.embedColor);

        await client.guildData.findOneAndUpdate({ id: interaction.guildId }, { $set: { locale: newLocale } }, { upsert: true, new: true });

        const data = client.data.get(`guildData_${interaction.guildId}`) || {};
        data.locale = newLocale;
        client.data.set(`guildData_${interaction.guildId}`, data);

        embed.setDescription(t(newLocale, "commands.language.updated", { locale: newLocale }));

        return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
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
