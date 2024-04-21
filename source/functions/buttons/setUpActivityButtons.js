const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');

const activityButtons = async (interaction, disableGroupReadyButton) => {
	const joinToActivityId = buttons.joinToActivity;
	const leaveFromActivityId = buttons.leaveFromActivity;
	const groupReadyId = buttons.groupReadyToActivity;
	const localizedText = await getLocalizedText(interaction);

	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(joinToActivityId)
			.setLabel(localizedText.components.buttons.activity.joinToActivity.name)
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId(leaveFromActivityId)
			.setLabel(
				localizedText.components.buttons.activity.leaveFromActivity.name
			)
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId(groupReadyId)
			.setLabel(
				localizedText.components.buttons.activity.groupReadyToActivity.name
			)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disableGroupReadyButton)
	);
};

module.exports = { activityButtons };
