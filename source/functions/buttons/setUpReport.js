const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');

const reportButtons = async localizedText =>
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(buttons.sendReport)
			.setLabel(localizedText.components.buttons.report.sendReport.name)
			.setStyle(ButtonStyle.Success)
	);

module.exports = { reportButtons };
