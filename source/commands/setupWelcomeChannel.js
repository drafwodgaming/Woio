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
		.setName(enCommands.welcomeChannel.name)
		.setDescription(enCommands.welcomeChannel.selectChannel)
		.setDescriptionLocalizations({
			ru: ruCommands.welcomeChannel.selectChannel,
			uk: ukCommands.welcomeChannel.selectChannel,
		})
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName(enCommands.subcommands.setup)
				.setDescription(enCommands.welcomeChannel.setupChannel)
				.setDescriptionLocalizations({
					ru: ruCommands.welcomeChannel.setupChannel,
					uk: ukCommands.welcomeChannel.setupChannel,
				})
				.addChannelOption(option =>
					option
						.setName(enCommands.options.channelOption)
						.setDescription(enCommands.welcomeChannel.channelOption)
						.setDescriptionLocalizations({
							ru: ruCommands.welcomeChannel.channelOption,
							uk: ukCommands.welcomeChannel.channelOption,
						})
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName(enCommands.subcommands.disable)
				.setDescription(enCommands.welcomeChannel.disableChannel)
				.setDescriptionLocalizations({
					ru: ruCommands.welcomeChannel.disableChannel,
					uk: ukCommands.welcomeChannel.disableChannel,
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

		const welcomeChannelSchema = client.models.get('welcomeChannel');

		const channelOption = options.getChannel(enCommands.options.channelOption);

		let responseEmbed;
		let description;

		switch (subCommand) {
			case enCommands.subcommands.setup:
				const updateData = await welcomeChannelSchema.findOneAndUpdate(
					{ guildId },
					{ $set: { channelId: channelOption.id } },
					{ upsert: true }
				);

				description = updateData
					? mustache.render(locale.commands.welcomeChannel.editedChannel, {
							channelId: channelOption.id,
					  })
					: mustache.render(locale.commands.welcomeChannel.installedChannel, {
							channelId: channelOption.id,
					  });

				responseEmbed = {
					color: updateData ? editBlueColor : installGreenColor,
					description,
				};
				break;

			case enCommands.subcommands.disable:
				const deletedData = await welcomeChannelSchema.findOneAndDelete({
					guildId,
				});

				description = deletedData
					? mustache.render(locale.commands.welcomeChannel.deletedChannel)
					: mustache.render(locale.commands.welcomeChannel.noChannel, {
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
