const { PermissionsBitField, MessageFlags } = require("discord.js");
const { t, resolveLocale } = require("../utils/i18n");

module.exports = {
    permissions: async (client, response, command, embed, player, args) => {
        const locale = resolveLocale(client, response.guildId, response.member?.id);

        if (command.permissions.bot) {
            if (!response.guild.members.me.permissions.has(command.permissions.bot || [])) {
                embed.setDescription(t(locale, "errors.botPermission", { perm: command.permissions.bot.join(", ") }));

                return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }
        }

        if (command.permissions.user) {
            if (!response.member.permissions.has(command.permissions.user || [])) {
                embed.setDescription(t(locale, "errors.userPermission", { perm: command.permissions.user.join(", ") }));

                return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }
        }

        if (command.settings.voice) {
            if (!response.member.voice.channel) {
                embed.setDescription(t(locale, "errors.notInVoice"));

                return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }

            if (
                !response.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect) ||
                !response.guild.members.me.permissionsIn(response.member.voice.channelId).has(PermissionsBitField.Flags.Connect)
            ) {
                embed.setDescription(t(locale, "errors.botConnectPermission"));

                return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }

            if (
                !response.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak) ||
                !response.guild.members.me.permissionsIn(response.member.voice.channelId).has(PermissionsBitField.Flags.Speak)
            ) {
                embed.setDescription(t(locale, "errors.botSpeakPermission"));

                return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }

            if (response.member.voice.channel.type === 13) {
                if (
                    !response.guild.members.me.permissions.has(PermissionsBitField.Flags.RequestToSpeak) ||
                    !response.guild.members.me.permissionsIn(response.member.voice.channelId).has(PermissionsBitField.Flags.RequestToSpeak)
                ) {
                    embed.setDescription(t(locale, "errors.botRequestToSpeak"));

                    return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
                }

                if (
                    !response.guild.members.me.permissions.has(PermissionsBitField.Flags.PrioritySpeaker) ||
                    !response.guild.members.me.permissionsIn(response.member.voice.channelId).has(PermissionsBitField.Flags.PrioritySpeaker)
                ) {
                    embed.setDescription(t(locale, "errors.botPrioritySpeaker"));

                    return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
                }
            }
        }

        if (command.settings.player) {
            if (!player) {
                embed.setDescription(t(locale, "errors.noPlayer"));

                return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }

            if (player.voiceId !== response.member.voice.channelId) {
                embed.setDescription(t(locale, "errors.joinSameVoice"));

                return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }
        }

        if (command.settings.current) {
            if (!player.queue.current) {
                embed.setDescription(t(locale, "errors.noCurrentSong"));

                return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }
        }

        if (command.devOnly) {
            if (!client.config.dev.includes(response.member.id)) {
                embed.setDescription(t(locale, "errors.devOnly"));

                return response.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }
        }

        try {
            command.run(client, response, player, args);
        } catch (error) {
            Logger.error("Failed to execute command:", error);
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
