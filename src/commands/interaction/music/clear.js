const { EmbedBuilder, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../../../utils/i18n");

module.exports = {
    name: "clear",
    description: "Clear the queue",
    description_localizations: {
        id: "Bersihkan antrian",
        fr: "Vider la file d'attente",
        ja: "キューをクリア",
        ko: "대기열 비우기",
        "zh-CN": "清空队列",
        "en-GB": "Clear the queue",
        "es-ES": "Vaciar la cola",
        de: "Warteschlange leeren",
        "pt-BR": "Limpar a fila",
        ru: "Очистить очередь",
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

        if (player.queue.isEmpty) {
            embed.setDescription(t(locale, "commands.clear.alreadyEmpty"));

            return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        player.queue.clear();

        embed.setDescription(t(locale, "commands.clear.cleared"));

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
