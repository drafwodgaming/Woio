const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { modals } = require('@config/componentsId.json');

const createTempChannelLimitModal = localization => {
	const componentsData = [
		{
			inputId: modals.tempChannelLimitInput,
			label: localization.components.modals.setLimitTempChannel.label,
			style: TextInputStyle.Short,
			placeholder:
				localization.components.modals.setLimitTempChannel
					.unlimitedLimitExample,
		},
	];

	const tempChannelLimit = new ModalBuilder()
		.setCustomId(modals.tempChannelLimit)
		.setTitle(localization.components.modals.setLimitTempChannel.title);

	componentsData.forEach(({ inputId, label, style, placeholder }) => {
		const inputField = new TextInputBuilder()
			.setCustomId(inputId)
			.setLabel(label)
			.setStyle(style)
			.setPlaceholder(placeholder);

		const row = new ActionRowBuilder().addComponents(inputField);

		tempChannelLimit.addComponents(row);
	});

	return tempChannelLimit;
};
module.exports = { createTempChannelLimitModal };
