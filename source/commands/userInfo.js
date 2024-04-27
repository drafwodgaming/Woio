const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	AttachmentBuilder,
} = require('discord.js');
const { profileImage } = require('discord-arts');
const { getColor } = require('@functions/utils/general/getColor');
const { getLocalizedText } = require('@functions/locale/getLocale');
const mustache = require('mustache');
const {
	getStatusText,
} = require('@source/functions/utils/userInfo/getStatusText');

const { commands: enCommands } = require('@config/languages/en.json');
const { commands: ruCommands } = require('@config/languages/ru.json');
const { commands: ukCommands } = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(enCommands.userInfo.name)
		.setDescription(enCommands.userInfo.description)
		.setDescriptionLocalizations({
			ru: ruCommands.userInfo.description,
			uk: ukCommands.userInfo.description,
		})
		.setDMPermission(false)
		.addUserOption(option =>
			option
				.setName(enCommands.options.userOption)
				.setDescription(enCommands.userInfo.userOption)
				.setDescriptionLocalizations({
					ru: ruCommands.userInfo.userOption,
					uk: ukCommands.userInfo.userOption,
				})
				.setRequired(false)
		)
		.setDMPermission(false),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.deferReply();
		const { options, member } = interaction;

		const locale = await getLocalizedText(interaction);
		const defaultBotColor = getColor('default');

		const targetUser =
			options.getMember(enCommands.options.userOption) || member;

		const userCreatedAt = targetUser.user.createdAt;

		const profileImageBuffer = await profileImage(targetUser.id, {
			badgesFrame: true,
		});
		const imageAttachment = new AttachmentBuilder(profileImageBuffer, {
			name: 'profile.png',
		});

		const memberJoinedTime = targetUser.joinedAt;
		const roleCache = targetUser.roles.cache;

		const userRoles = roleCache
			.filter(role => role.id !== targetUser.guild.roles.everyone.id)
			.map(role => role)
			.slice(0, 3)
			.join(', ');
		const userRolesCount = roleCache.size;

		const { status = 'offline' } = targetUser.presence || {};
		const statusText = getStatusText(status, locale);

		const userInfoTitle = locale.commands.userInfo.title;

		const imageEmbed = { url: 'attachment://profile.png' };

		const userInfoEmbed = {
			color: defaultBotColor,
			title: userInfoTitle,
			image: imageEmbed,
			timestamp: new Date(),
			fields: [
				{
					name: locale.commands.userInfo.createdAt,
					value: mustache.render(locale.commands.userInfo.createdTime, {
						userCreatedAt: `<t:${Math.floor(userCreatedAt / 1000)}:R>`,
					}),
					inline: true,
				},
				{
					name: locale.commands.userInfo.joinedAt,
					value: mustache.render(locale.commands.userInfo.joinedTime, {
						memberJoinedTime: `<t:${Math.floor(memberJoinedTime / 1000)}:R>`,
					}),
					inline: true,
				},
				{
					name: locale.commands.userInfo.memberRoles,
					value:
						userRolesCount > 0
							? userRoles
							: locale.commands.userInfo.emptyRolesList,
				},
				{
					name: locale.commands.userInfo.statusLabel,
					value: statusText,
					inline: true,
				},
			],
		};
		await interaction.editReply({
			embeds: [userInfoEmbed],
			files: [imageAttachment],
		});
	},
};
