const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
} = require('discord.js');
const { getColor } = require('@functions/utils/general/getColor');
const { warning } = require('@config/emojis.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const mustache = require('mustache');

const { commands: enCommands } = require('@config/languages/en.json');
const { commands: ruCommands } = require('@config/languages/ru.json');
const { commands: ukCommands } = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(enCommands.leaveChannel.name)
		.setDescription(enCommands.leaveChannel.selectChannel)
		.setDescriptionLocalizations({
			ru: ruCommands.leaveChannel.selectChannel,
			uk: ukCommands.leaveChannel.selectChannel,
		})
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName(enCommands.subcommands.setup)
				.setDescription(enCommands.leaveChannel.setupChannel)
				.setDescriptionLocalizations({
					ru: ruCommands.leaveChannel.setupChannel,
					uk: ukCommands.leaveChannel.setupChannel,
				})
				.addChannelOption(option =>
					option
						.setName(enCommands.options.channelOption)
						.setDescription(enCommands.leaveChannel.channelOption)
						.setDescriptionLocalizations({
							ru: ruCommands.leaveChannel.channelOption,
							uk: ukCommands.leaveChannel.channelOption,
						})
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName(enCommands.subcommands.disable)
				.setDescription(enCommands.leaveChannel.disableChannel)
				.setDescriptionLocalizations({
					ru: ruCommands.leaveChannel.disableChannel,
					uk: ukCommands.leaveChannel.disableChannel,
				})
		)
		.setDMPermission(false),
	async execute(interaction) {
		const { guild, options, client } = interaction;
		const subCommand = options.getSubcommand();
		const { id: guildId } = guild;

		const locale = await getLocalizedText(interaction);

		const defaultBotColor = getColor('default');
		const installGreenColor = getColor('succesGreen');
		const editBlueColor = getColor('editBlue');
		const errorRedColor = getColor('errorRed');

		const leaveChannelSchema = client.models.get('leaveChannel');

		const channelOption = options.getChannel(enCommands.options.channelOption);

		let responseEmbed;
		let description;

		switch (subCommand) {
			case enCommands.subcommands.setup:
				const updateData = await leaveChannelSchema.findOneAndUpdate(
					{ guildId },
					{ $set: { channelId: channelOption.id } },
					{ upsert: true }
				);

				description = updateData
					? mustache.render(locale.commands.leaveChannel.editedChannel, {
							channelId: channelOption.id,
					  })
					: mustache.render(locale.commands.leaveChannel.installedChannel, {
							channelId: channelOption.id,
					  });

				responseEmbed = {
					color: updateData ? editBlueColor : installGreenColor,
					description,
				};
				break;

			case enCommands.subcommands.disable:
				const deletedData = await leaveChannelSchema.findOneAndDelete({
					guildId,
				});

				description = deletedData
					? mustache.render(locale.commands.leaveChannel.deletedChannel)
					: mustache.render(locale.commands.leaveChannel.noChannel, {
							warningEmoji: warning,
					  });

				responseEmbed = {
					color: deletedData ? errorRedColor : defaultBotColor,
					description,
				};
				break;
		}
		await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
	},
};
