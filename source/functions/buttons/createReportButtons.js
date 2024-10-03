const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const {
	buttons: { sendReport },
} = require('@config/componentsId.json');

const createReportButtons = localization =>
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(sendReport)
			.setLabel(localization.components.buttons.report.sendReport.name)
			.setStyle(ButtonStyle.Success)
	);

module.exports = { createReportButtons };
