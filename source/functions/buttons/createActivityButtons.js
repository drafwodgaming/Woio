const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const {
	buttons: { joinToActivity, leaveFromActivity, groupReadyToActivity },
} = require('@config/componentsId.json');

const createActivityButtons = (localization, disableGroupReadyButton) => {
	const buttonsData = [
		{
			customId: joinToActivity,
			label: localization.components.buttons.activity.joinToActivity.name,
			style: ButtonStyle.Success,
		},
		{
			customId: leaveFromActivity,
			label: localization.components.buttons.activity.leaveFromActivity.name,
			style: ButtonStyle.Danger,
		},
		{
			customId: groupReadyToActivity,
			label: localization.components.buttons.activity.groupReadyToActivity.name,
			style: ButtonStyle.Primary,
			disabled: disableGroupReadyButton,
		},
	];

	const buttons = buttonsData.map(buttonData => new ButtonBuilder(buttonData));
	return new ActionRowBuilder().addComponents(buttons);
};

module.exports = { createActivityButtons };
