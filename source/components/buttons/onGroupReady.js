const { userMention } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const mustache = require('mustache');
const {
	editActivityMessage,
} = require('@functions/utils/activity/editActivityMessage');

module.exports = {
	data: {
		name: buttons.groupReadyToActivity,
	},
	async execute(interaction) {
		const { user, message, client } = interaction;
		const { id: messageId } = message;
		const { id: userId } = user;
		const locale = await getLocalizedText(interaction);

		const activitySchema = client.models.get('activity');
		const activityRecord = await activitySchema.findOne({ messageId });

		const replyEphemeral = content =>
			interaction.reply({ content, ephemeral: true });

		const isOwner = activityRecord.ownerId === userId;
		if (!isOwner)
			return replyEphemeral(
				locale.components.buttons.activity.groupReadyToActivity.ownerOnly
			);

		const acceptedPlayers = activityRecord.acceptedPlayers
			.map(playerId => userMention(playerId))
			.join(', ');

		await editActivityMessage(interaction, activityRecord, locale);

		const deleteMessagePromise = message.delete();
		const deleteActivityPromise = activitySchema.findOneAndDelete({
			messageId,
		});
		const replyPromise = interaction.reply({
			content: mustache.render(
				locale.components.buttons.activity.groupReadyToActivity.pingPlayers,
				{ acceptedPlayers }
			),
		});

		await Promise.all([
			deleteMessagePromise,
			deleteActivityPromise,
			replyPromise,
		]);
	},
};
