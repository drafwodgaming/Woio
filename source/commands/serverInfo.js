const { SlashCommandBuilder, ChannelType, bold } = require('discord.js');
const mustache = require('mustache');
const { getColor } = require('@functions/utils/general/getColor');
const emojis = require('@config/emojis.json');
const { getLocalizedText } = require('@functions/locale/getLocale');

const { commands: enCommands } = require('@config/languages/en.json');
const { commands: ruCommands } = require('@config/languages/ru.json');
const { commands: ukCommands } = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(enCommands.serverInfo.name)
		.setDescription(enCommands.serverInfo.description)
		.setDescriptionLocalizations({
			ru: ruCommands.serverInfo.description,
			uk: ukCommands.serverInfo.description,
		})
		.setDMPermission(false),
	async execute(interaction) {
		const { guild } = interaction;
		const { name, ownerId, createdTimestamp, description } = guild;
		const { members, roles, channels, id: guildId } = guild;

		const locale = await getLocalizedText(interaction);
		const defaultBotColor = getColor('default');

		const guildMembersCount = members.cache.filter(
			member => !member.user.bot
		).size;
		const botMembersCount = members.cache.size - guildMembersCount;
		const totalMembersCount = members.cache.size;

		const guildIcon = guild.iconURL();

		const textChannelsIco = emojis.textChannel;
		const voiceChannelsIco = emojis.voiceChannel;
		const categoriesIco = emojis.category;
		const annnouncementChannelIco = emojis.announcement;
		const stageChannelIco = emojis.stage;
		const forumIco = emojis.forum;

		const guildChannels = channels.cache.size;
		const guildCategories = channels.cache.filter(
			c => c.type === ChannelType.GuildCategory
		).size;
		const textChannels = channels.cache.filter(
			c => c.type === ChannelType.GuildText
		).size;
		const voiceChannels = channels.cache.filter(
			channel => channel.type === ChannelType.GuildVoice
		).size;
		const annnouncementChannel = guild.channels.cache.filter(
			channel => channel.type === ChannelType.GuildAnnouncement
		).size;
		const stageChannel = channels.cache.filter(
			channel => channel.type === ChannelType.GuildStageVoice
		).size;
		const forum = channels.cache.filter(
			channel => channel.type === ChannelType.GuildForum
		).size;

		const guildEmojis = guild.emojis.cache;
		const totalEmojisCount = guildEmojis.size;
		const animatedEmojisCount = guildEmojis.filter(
			emoji => emoji.animated
		).size;
		const staticEmojisCount = totalEmojisCount - animatedEmojisCount;

		const guildRoles = roles.cache
			.map(role => role)
			.slice(0, 15)
			.join(' ');
		const guildRolesCount = roles.cache.size;

		const guildDescription =
			description || locale.commands.serverInfo.noDescription;

		const serverInfoEmbed = {
			color: defaultBotColor,
			description: bold(guildDescription),
			fields: [
				{
					name: locale.commands.serverInfo.generalLabel,
					value: [
						mustache.render(locale.commands.serverInfo.ownerId, {
							ownerId,
						}),
						mustache.render(locale.commands.serverInfo.createdAt, {
							guildCreatedAt: `<t:${parseInt(createdTimestamp / 1000)}:R>`,
						}),
					].join('\n'),
				},
				{
					name: mustache.render(locale.commands.serverInfo.totalMembersCount, {
						totalMembersCount,
					}),
					value: [
						mustache.render(locale.commands.serverInfo.guildMembersCount, {
							guildMembersCount,
						}),
						mustache.render(locale.commands.serverInfo.guildBotsCount, {
							botMembersCount,
						}),
					].join('\n'),
				},
				{
					name: mustache.render(locale.commands.serverInfo.totalChannelsCount, {
						guildChannels,
					}),
					value: [
						mustache.render(locale.commands.serverInfo.textChannelsCount, {
							textChannelsIco,
							textChannels,
						}),
						mustache.render(locale.commands.serverInfo.voiceChannelsCount, {
							voiceChannelsIco,
							voiceChannels,
						}),
						mustache.render(locale.commands.serverInfo.categoriesCount, {
							categoriesIco,
							guildCategories,
						}),
						mustache.render(
							locale.commands.serverInfo.annnouncementChannelsCount,
							{ annnouncementChannelIco, annnouncementChannel }
						),
						mustache.render(locale.commands.serverInfo.stageChannelsCount, {
							stageChannelIco,
							stageChannel,
						}),
						mustache.render(locale.commands.serverInfo.forumCount, {
							forumIco,
							forum,
						}),
					].join(' | '),
				},
				{
					name: mustache.render(locale.commands.serverInfo.totalEmojisCount, {
						totalEmojisCount,
					}),
					value: [
						mustache.render(locale.commands.serverInfo.animatedEmojisCount, {
							animatedEmojisCount,
						}),
						mustache.render(locale.commands.serverInfo.staticEmojisCount, {
							staticEmojisCount,
						}),
					].join('\n'),
				},
				{
					name: mustache.render(locale.commands.serverInfo.guildRolesCount, {
						guildRolesCount,
					}),
					value: guildRoles,
				},
			],
			thumbnail: { url: guildIcon },
			author: { name: name, iconURL: guildIcon },
			footer: { text: guildId },
			timestamp: new Date(),
		};

		await interaction.reply({ embeds: [serverInfoEmbed] });
	},
};
