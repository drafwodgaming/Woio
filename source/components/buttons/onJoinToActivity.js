const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	editActivityMessage,
} = require('@functions/utils/activity/editActivityMessage');

module.exports = {
	data: {
		name: buttons.joinToActivity,
	},
	async execute(interaction) {
		const { user, message, client } = interaction;
		const { id: messageId } = message;
		const locale = await getLocalizedText(interaction);

		const activitySchema = client.models.get('activity');
		const activityRecord = await activitySchema.findOne({ messageId });

		const replyEphemeral = content =>
			interaction.reply({ content, ephemeral: true });

		if (!activityRecord)
			return replyEphemeral(
				locale.components.buttons.activity.joinToActivity.deletedActivity
			);

		const isOwner = activityRecord.ownerId === user.id;
		if (isOwner)
			return replyEphemeral(
				locale.components.buttons.activity.joinToActivity.ownerCannotJoin
			);

		const isPlayerInGroup = activityRecord.acceptedPlayers.includes(user.id);
		if (isPlayerInGroup)
			return replyEphemeral(
				locale.components.buttons.activity.joinToActivity.alreadyInGroup
			);

		const isGroupFull =
			activityRecord.acceptedPlayers.length === activityRecord.maxPlayersCount;
		if (isGroupFull)
			return replyEphemeral(
				locale.components.buttons.activity.joinToActivity.groupFull
			);

		const updatedEvent = await activitySchema.findOneAndUpdate(
			{ messageId },
			{ $push: { acceptedPlayers: user.id } },
			{ upsert: true, new: true }
		);

		await editActivityMessage(interaction, updatedEvent, locale);

		await replyEphemeral(
			locale.components.buttons.activity.joinToActivity.successJoinToActivity
		);
	},
};
