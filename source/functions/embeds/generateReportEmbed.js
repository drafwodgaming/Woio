const mustache = require('mustache');
const emojis = require('@config/emojis.json');
const { getColor } = require('@functions/utils/getColor');

function generateReportEmbed(
	selectedReport,
	descriptionReport,
	localizedText,
	interaction
) {
	const emoji = emojis[selectedReport];
	const color = getColor(`reports.${selectedReport}`);
	const title = mustache.render(
		localizedText.commands.report[`${selectedReport}Title`],
		{ [selectedReport]: emoji }
	);

	return {
		color: color,
		title: title,
		description: mustache.render(localizedText.commands.report.reportBy, {
			user: interaction.user.username,
			guild: interaction.guild.name,
		}),
		fields: [
			{
				name: localizedText.commands.report.fields.description,
				value: `\`\`\`${descriptionReport}\`\`\``,
				inline: true,
			},
		],
	};
}

module.exports = { generateReportEmbed };
