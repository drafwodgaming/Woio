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
		.setName(enCommands.joinToCreateChannel.name)
		.setDescription(enCommands.joinToCreateChannel.selectChannel)
		.setDescriptionLocalizations({
			ru: ruCommands.joinToCreateChannel.selectChannel,
			uk: ukCommands.joinToCreateChannel.selectChannel,
		})
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName(enCommands.subcommands.setup)
				.setDescription(enCommands.joinToCreateChannel.setupChannel)
				.setDescriptionLocalizations({
					ru: ruCommands.joinToCreateChannel.setupChannel,
					uk: ukCommands.joinToCreateChannel.setupChannel,
				})
				.addChannelOption(option =>
					option
						.setName(enCommands.options.channelOption)
						.setDescription(enCommands.joinToCreateChannel.channelOption)
						.setDescriptionLocalizations({
							ru: ruCommands.joinToCreateChannel.channelOption,
							uk: ukCommands.joinToCreateChannel.channelOption,
						})
						.addChannelTypes(ChannelType.GuildVoice)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName(enCommands.subcommands.disable)
				.setDescription(enCommands.joinToCreateChannel.disableChannel)
				.setDescriptionLocalizations({
					ru: ruCommands.joinToCreateChannel.disableChannel,
					uk: ukCommands.joinToCreateChannel.disableChannel,
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

		const joinToCreateSchema = client.models.get('joinToCreate');

		const channelOption = options.getChannel(enCommands.options.channelOption);

		let description;

		switch (subCommand) {
			case enCommands.subcommands.setup:
				const updateData = await joinToCreateSchema.findOneAndUpdate(
					{ guildId },
					{ $set: { channelId: channelOption.id } },
					{ upsert: true }
				);

				description = updateData
					? mustache.render(locale.commands.joinToCreateChannel.editedChannel, {
							channelId: channelOption.id,
					  })
					: mustache.render(
							locale.commands.joinToCreateChannel.installedChannel,
							{ channelId: channelOption.id }
					  );

				const enableResponseEmbed = {
					color: updateData ? editBlueColor : installGreenColor,
					description,
				};
				return interaction.reply({ embeds: [enableResponseEmbed] });

			case enCommands.subcommands.disable:
				const deletedData = await joinToCreateSchema.findOneAndDelete({
					guildId,
				});
				description = deletedData
					? mustache.render(locale.commands.joinToCreateChannel.deletedChannel)
					: mustache.render(locale.commands.joinToCreateChannel.noChannel, {
							warningEmoji: warning,
					  });
				const disableResponseEmbed = {
					color: deletedData ? errorRedColor : defaultBotColor,
					description,
				};
				return interaction.reply({ embeds: [disableResponseEmbed] });
		}
	},
};
