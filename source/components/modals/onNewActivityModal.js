const { modals } = require('@config/componentsId.json');
const {
	createActivityButtons,
} = require('@functions/buttons/createActivityButtons');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	generateActivityEmbed,
} = require('@functions/embeds/generateActivityEmbed');
const { getColor } = require('@functions/utils/general/getColor');

module.exports = {
	data: {
		name: modals.newActivity,
	},
	async execute(interaction) {
		const { fields, user, guild, channel } = interaction;
		const { roles, id: guildId } = guild;
		const { id: channelId } = channel;
		const { id: userId } = user;
		const { activityTitle, activityDescription, activityPlayersCount, roleId } =
			modals;

		const locale = await getLocalizedText(interaction);

		const activityData = {
			title: fields.getTextInputValue(activityTitle),
			description: fields.getTextInputValue(activityDescription),
			playersCount: parseInt(
				fields.getTextInputValue(activityPlayersCount),
				10
			),
			role: fields.getTextInputValue(roleId).trim(),
		};

		await roles.fetch();
		const role = roles.cache.get(activityData.role);

		if (!role)
			return interaction.reply({
				content:
					locale.components.modals.newActivity.activityPingRole
						.roleNotFoundMessage,
				ephemeral: true,
			});

		const pingRole = role.toString();

		const colorActivity = getColor('activity.redColor');

		if (isNaN(activityData.playersCount) || activityData.playersCount <= 0)
			return interaction.reply({
				content:
					locale.components.modals.newActivity.activityPlayersCount
						.invalidNumberMessage,
				ephemeral: true,
			});

		const participantsFieldName =
			locale.components.modals.newActivity.activityInfo.playersField;

		const creatorId = interaction.user.id;
		const creatorIdFieldName =
			locale.components.modals.newActivity.activityInfo.creatorField;

		const creatorUser = await interaction.client.users.fetch(creatorId);
		const creatorAvatar = creatorUser.avatarURL();

		const embed = generateActivityEmbed({
			title: activityData.title,
			description: activityData.description,
			creatorId: creatorId,
			participants: [],
			maxPlayers: activityData.playersCount,
			creatorFieldName: creatorIdFieldName,
			participantsFieldName: participantsFieldName,
			embedColor: colorActivity,
			ownerAvatarUrl: creatorAvatar,
		});

		await interaction.reply({
			content: pingRole,
			embeds: [embed],
			components: [await createActivityButtons(locale, true)],
		});

		await interaction.fetchReply().then(async reply => {
			const activityModel = interaction.client.models.get('activity');
			await activityModel.findOneAndUpdate(
				{ ownerId: userId },
				{
					$set: {
						name: activityData.title,
						description: activityData.description,
						maxPlayersCount: activityData.playersCount,
						messageId: reply.id,
						guildId,
						channelId,
						roleId: role.id,
					},
				},
				{ upsert: true }
			);
		});
	},
};
