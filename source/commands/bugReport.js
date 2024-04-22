const { SlashCommandBuilder } = require('discord.js');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	createReportButtons,
} = require('@functions/buttons/createReportButtons');
const {
	generateReportEmbed,
} = require('@functions/embeds/generateReportEmbed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.report.name)
		.setDescription(en.commands.report.description)
		.setDescriptionLocalizations({
			ru: ru.commands.report.description,
			uk: uk.commands.report.description,
		})
		.addStringOption(option =>
			option
				.setName(en.commands.options.typeReportOption)
				.setDescription(en.commands.report.typeDescription)
				.setDescriptionLocalizations({
					ru: ru.commands.report.typeDescription,
					uk: uk.commands.report.typeDescription,
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
				.setName(en.commands.options.reportDescriptionOption)
				.setDescription(en.commands.report.reportDescription)
				.setDescriptionLocalizations({
					ru: ru.commands.report.reportDescription,
					uk: uk.commands.report.reportDescription,
				})
				.setRequired(true)
		)
		.setDMPermission(false),
	async execute(interaction) {
		const { options } = interaction;
		const selectedReport = options.getString(
			en.commands.options.typeReportOption
		);
		const descriptionReport = options.getString(
			en.commands.options.reportDescriptionOption
		);

		const localizedText = await getLocalizedText(interaction);

		const embed = generateReportEmbed(
			interaction,
			localizedText,
			selectedReport,
			descriptionReport
		);

		await interaction.reply({
			content: localizedText.commands.report.preview,
			embeds: [embed],
			components: [await createReportButtons(localizedText)],
			fetchReply: true,
			ephemeral: true,
		});
	},
};
