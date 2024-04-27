const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { modals } = require('@config/componentsId.json');

const createTempChannelNameModal = locale => {
	const componentsData = [
		{
			inputId: modals.tempChannelNameInput,
			label: locale.components.modals.setNameTempChannel.label,
			style: TextInputStyle.Short,
			placeholder: locale.components.modals.setNameTempChannel.exampleName,
		},
	];

	const tempChannelName = new ModalBuilder()
		.setCustomId(modals.tempChannelName)
		.setTitle(locale.components.modals.setNameTempChannel.title);

	componentsData.forEach(({ inputId, label, style, placeholder }) => {
		const inputField = new TextInputBuilder()
			.setCustomId(inputId)
			.setLabel(label)
			.setStyle(style)
			.setPlaceholder(placeholder);

		const row = new ActionRowBuilder().addComponents(inputField);

		tempChannelName.addComponents(row);
	});

	return tempChannelName;
};
module.exports = { createTempChannelNameModal };
