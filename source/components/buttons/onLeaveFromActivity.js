const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	editActivityMessage,
} = require('@functions/utils/activity/editActivityMessage');

module.exports = {
	data: {
		name: buttons.leaveFromActivity,
	},
	async execute(interaction) {
		const { user, message, client } = interaction;
		const { id: messageId } = message;
		const locale = await getLocalizedText(interaction);
		const activityModel = client.models.get('activity');

		const activityRecord = await activityModel.findOne({ messageId });

		const replyEphemeral = content =>
			interaction.reply({ content, ephemeral: true });

		if (!activityRecord)
			return replyEphemeral(
				locale.components.buttons.activity.leaveFromActivity.deletedActivity
			);

		const isOwner = activityRecord.ownerId === user.id;
		if (isOwner)
			return replyEphemeral(
				locale.components.buttons.activity.leaveFromActivity.ownerCannotLeave
			);

		const isPlayerInGroup = activityRecord.acceptedPlayers.includes(user.id);
		user.id;
		if (!isPlayerInGroup)
			return replyEphemeral(
				locale.components.buttons.activity.leaveFromActivity.noInGroup
			);

		const updatedEvent = await activityModel.findOneAndUpdate(
			{ messageId },
			{ $pull: { acceptedPlayers: user.id } },
			{ upsert: true, new: true }
		);

		await editActivityMessage(interaction, updatedEvent, locale);

		await replyEphemeral(
			locale.components.buttons.activity.leaveFromActivity
				.successLeaveFromActivity
		);
	},
};
