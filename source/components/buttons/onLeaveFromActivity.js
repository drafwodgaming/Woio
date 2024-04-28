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
		const { id: userId } = user;
		const locale = await getLocalizedText(interaction);
		const activityModel = client.models.get('activity');

		const activityRecord = await activityModel.findOne({ messageId });

		const replyEphemeral = content =>
			interaction.reply({ content, ephemeral: true });

		if (!activityRecord)
			return replyEphemeral(
				locale.components.buttons.activity.leaveFromActivity.deletedActivity
			);

		const isOwner = activityRecord.ownerId === userId;
		if (isOwner)
			return replyEphemeral(
				locale.components.buttons.activity.leaveFromActivity.ownerCannotLeave
			);

		const isPlayerInGroup = activityRecord.acceptedPlayers.includes(userId);
		if (!isPlayerInGroup)
			return replyEphemeral(
				locale.components.buttons.activity.leaveFromActivity.noInGroup
			);

		const updatedEvent = await activityModel.findOneAndUpdate(
			{ messageId },
			{ $pull: { acceptedPlayers: userId } },
			{ upsert: true, new: true }
		);

		await editActivityMessage(interaction, updatedEvent, locale);

		await replyEphemeral(
			locale.components.buttons.activity.leaveFromActivity
				.successLeaveFromActivity
		);
	},
};
