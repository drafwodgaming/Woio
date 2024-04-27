const { SlashCommandBuilder } = require('discord.js');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	createReportButtons,
} = require('@functions/buttons/createReportButtons');
const {
	generateReportEmbed,
} = require('@functions/embeds/generateReportEmbed');

const { commands: enCommands } = require('@config/languages/en.json');
const { commands: ruCommands } = require('@config/languages/ru.json');
const { commands: ukCommands } = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(enCommands.report.name)
		.setDescription(enCommands.report.description)
		.setDescriptionLocalizations({
			ru: ruCommands.report.description,
			uk: ukCommands.report.description,
		})
		.addStringOption(option =>
			option
				.setName(enCommands.options.typeReportOption)
				.setDescription(enCommands.report.typeDescription)
				.setDescriptionLocalizations({
					ru: ruCommands.report.typeDescription,
					uk: ukCommands.report.typeDescription,
				})
				.setRequired(true)
				.addChoices(
					{ name: 'Bug', value: 'bug' },
					{ name: 'Suggestions', value: 'suggestion' },
					{ name: 'Other', value: 'other' }
				)
		)
		.addStringOption(option =>
			option
				.setName(enCommands.options.reportDescriptionOption)
				.setDescription(enCommands.report.reportDescription)
				.setDescriptionLocalizations({
					ru: ruCommands.report.reportDescription,
					uk: ukCommands.report.reportDescription,
				})
				.setRequired(true)
		)
		.setDMPermission(false),
	async execute(interaction) {
		const { options } = interaction;
		const locale = await getLocalizedText(interaction);

		const selectedReport = options.getString(
			enCommands.options.typeReportOption
		);
		const description = options.getString(
			enCommands.options.reportDescriptionOption
		);

		const embed = generateReportEmbed({
			interaction,
			locale,
			type: selectedReport,
			description,
		});

		await interaction.reply({
			content: locale.commands.report.preview,
			embeds: [embed],
			components: [await createReportButtons(locale)],
			fetchReply: true,
			ephemeral: true,
		});
	},
};
