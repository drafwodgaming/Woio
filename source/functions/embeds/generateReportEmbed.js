const mustache = require('mustache');
const emojis = require('@config/emojis.json');
const { getColor } = require('@functions/utils/getColor');

const generateReportEmbed = (
	interaction,
	localization,
	reportType,
	reportDescription
) => {
	const reportEmoji = emojis[reportType];
	const reportColor = getColor(`reports.${reportType}`);
	const reportTitle = mustache.render(
		localization.commands.report[`${reportType}Title`],
		{ [reportType]: reportEmoji }
	);
	const reportBy = mustache.render(localization.commands.report.reportBy, {
		user: interaction.user.username,
		guild: interaction.guild.name,
	});

	return {
		color: reportColor,
		title: reportTitle,
		description: reportBy,
		fields: [
			{
				name: localization.commands.report.fields.description,
				value: `\`\`\`${reportDescription}\`\`\``,
				inline: true,
			},
		],
	};
};

module.exports = { generateReportEmbed };
