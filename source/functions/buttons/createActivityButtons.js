const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const {
	buttons: { joinToActivity, leaveFromActivity, groupReadyToActivity },
} = require('@config/componentsId.json');

const createActivityButtons = (localization, disableGroupReadyButton) =>
	new ActionRowBuilder().addComponents(
		new ButtonBuilder({
			customId: joinToActivity,
			label: localization.components.buttons.activity.joinToActivity.name,
			style: ButtonStyle.Success,
		}),
		new ButtonBuilder({
			customId: leaveFromActivity,
			label: localization.components.buttons.activity.leaveFromActivity.name,
			style: ButtonStyle.Danger,
		}),
		new ButtonBuilder({
			customId: groupReadyToActivity,
			label: localization.components.buttons.activity.groupReadyToActivity.name,
			style: ButtonStyle.Primary,
			disabled: disableGroupReadyButton,
		})
	);

module.exports = { createActivityButtons };
