const {
	createActivityButtons,
} = require('@functions/buttons/createActivityButtons');
const {
	getColorByPercentage,
} = require('@functions/utils/activity/getColorByPercentage');
const {
	generateActivityEmbed,
} = require('@functions/embeds/generateActivityEmbed');

const editActivityMessage = async (interaction, database, locale) => {
	const isGroupNowFull =
		database.acceptedPlayers.length === database.maxPlayersCount;
	const components = await createActivityButtons(locale, !isGroupNowFull);
	const participantsFieldName =
		locale.components.modals.newActivity.activityInfo.playersField;
	const creatorIdFieldName =
		locale.components.modals.newActivity.activityInfo.creatorField;

	const percentage =
		(database.acceptedPlayers.length / database.maxPlayersCount) * 100;

	const colorActivity = getColorByPercentage(percentage);

	const creatorUser = await interaction.client.users.fetch(database.ownerId);
	const creatorAvatar = creatorUser.avatarURL();

	const embed = generateActivityEmbed({
		title: database.name,
		description: database.description,
		creatorId: database.ownerId,
		participants: database.acceptedPlayers,
		maxPlayers: database.maxPlayersCount,
		creatorFieldName: creatorIdFieldName,
		participantsFieldName: participantsFieldName,
		embedColor: colorActivity,
		ownerAvatarUrl: creatorAvatar,
	});

	await interaction.message.edit({
		embeds: [embed],
		components: [components],
	});
};

module.exports = { editActivityMessage };
