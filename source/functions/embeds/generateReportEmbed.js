const mustache = require('mustache');
const emojis = require('@config/emojis.json');
const { getColor } = require('@functions/utils/general/getColor');

const generateReportEmbed = ({ interaction, locale, type, description }) => {
	const reportEmoji = emojis[type];
	const reportColor = getColor(`reports.${type}`);
	const reportTitle = mustache.render(locale.commands.report[`${type}Title`], {
		[type]: reportEmoji,
	});
	const reportBy = mustache.render(locale.commands.report.reportBy, {
		user: interaction.user.username,
		guild: interaction.guild.name,
	});

	return {
		color: reportColor,
		title: reportTitle,
		description: reportBy,
		fields: [
			{
				name: locale.commands.report.fields.description,
				value: `\`\`\`${description}\`\`\``,
				inline: true,
			},
		],
	};
};

module.exports = { generateReportEmbed };
