const { SlashCommandBuilder } = require('discord.js');
const {
	createNewActivityModal,
} = require('@functions/modals/createNewActivityModal');
const { warning } = require('@config/emojis.json');
const {
	formatActivityLink,
} = require('@functions/formatter/formatActivityLink');
const { getLocalizedText } = require('@functions/locale/getLocale');
const { getColor } = require('@functions/utils/general/getColor');
const mustache = require('mustache');

const { commands: enCommands } = require('@config/languages/en.json');
const { commands: ruCommands } = require('@config/languages/ru.json');
const { commands: ukCommands } = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(enCommands.activity.name)
		.setDescription(enCommands.activity.description)
		.setDescriptionLocalizations({
			ru: ruCommands.activity.description,
			uk: ukCommands.activity.description,
		})
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName(enCommands.subcommands.newActivity)
				.setDescription(enCommands.activity.newActivity.description)
				.setDescriptionLocalizations({
					ru: ruCommands.activity.newActivity.description,
					uk: ukCommands.activity.newActivity.description,
				})
				.addRoleOption(option =>
					option
						.setName(enCommands.options.roleOption)
						.setDescription(enCommands.activity.newActivity.selectPingRole)
						.setDescriptionLocalizations({
							ru: ruCommands.activity.newActivity.selectPingRole,
							uk: ukCommands.activity.newActivity.selectPingRole,
						})
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName(enCommands.subcommands.searchActivity)
				.setDescription(enCommands.activity.searchActivity.description)
				.setDescriptionLocalizations({
					ru: ruCommands.activity.searchActivity.description,
					uk: ukCommands.activity.searchActivity.description,
				})
		),
	async execute(interaction) {
		const { options, client, guild } = interaction;
		const { id: guildId } = guild;
		const subCommand = options.getSubcommand();
		const locale = await getLocalizedText(interaction);
		const roleId = options.getRole(enCommands.options.roleOption);

		const linksColor = getColor('linksBlue');
		const defaultBotColor = getColor('default');
		let responseEmbed;

		switch (subCommand) {
			case enCommands.subcommands.newActivity:
				const modal = await createNewActivityModal(locale, roleId);
				return await interaction.showModal(modal);

			case enCommands.subcommands.searchActivity:
				const activitySchema = client.models.get('activity');
				const activities = await activitySchema.find({ guildId });
				const activityLinks = activities.map((activity, index) =>
					formatActivityLink({ interaction, locale, activity, index })
				);

				if (activities.length === 0) {
					responseEmbed = {
						description: mustache.render(
							locale.commands.activity.searchActivity.noActivities,
							{ warningEmoji: warning }
						),
						color: defaultBotColor,
					};
					return await interaction.reply({
						embeds: [responseEmbed],
						ephemeral: true,
					});
				}
				responseEmbed = {
					title: locale.commands.activity.searchActivity.title,
					description: activityLinks.join('\n'),
					color: linksColor,
				};

				return await interaction.reply({
					embeds: [responseEmbed],
					ephemeral: true,
				});
			default:
				return;
		}
	},
};
