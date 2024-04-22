const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const emojis = require('@config/emojis.json');
const ru = require('@config/languages/ru.json');

const createRulesButtons = () =>
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(buttons.rulesButton)
			.setLabel(ru.myServer.buttons.serverRules.label)
			.setStyle(ButtonStyle.Secondary)
			.setEmoji(emojis.rules)
	);

module.exports = { createRulesButtons };
