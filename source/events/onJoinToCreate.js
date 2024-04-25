const { Events } = require('discord.js');
const { createVoiceChannel } = require('@functions/utils/createVoiceChannel');
const {
	deleteEmptyTempChannels,
} = require('@functions/utils/deleteEmptyTempChannels');
const {
	createTempChannelSettings,
} = require('@functions/menus/createTempChannelSettings');
const { getColor } = require('@functions/utils/general/getColor');
const { getLocalizedText } = require('@functions/locale/getLocale');
const mustache = require('mustache');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const { member } = oldState || newState;
		const { guild, user, client } = member;
		const { id: guildId } = guild;
		const username = user.username;

		const joinToCreateSchema = client.models.get('joinToCreate');
		const joinToCreateData = await joinToCreateSchema.findOne({
			guildId,
		});

		if (!joinToCreateData) return;

		const temporaryChannels = client.models.get('temporaryChannels');
		const interactionChannelId = joinToCreateData.channelId;

		await deleteEmptyTempChannels(guild);

		if (interactionChannelId === newState.channelId) {
			const parentCategory = newState.channel?.parent;
			const localizedText = await getLocalizedText(member);
			const channelName = mustache.render(
				localizedText.events.joinToCreate.channelName,
				{ username }
			);

			const existingChannel = await temporaryChannels.findOne({
				guildId,
				channelId: newState.channelId,
			});

			if (!existingChannel) {
				const createdVoiceChannel = await createVoiceChannel(
					member.guild,
					member,
					channelName,
					0,
					parentCategory
				);

				if (createdVoiceChannel && newState) {
					newState.setChannel(createdVoiceChannel);

					await temporaryChannels.findOneAndUpdate(
						{ guildId, channelId: createdVoiceChannel.id },
						{ $set: { creatorId: member.id, channelName } },
						{ upsert: true }
					);

					const defaultBotColor = getColor('default');
					const embedMessage = {
						embeds: [
							{
								color: defaultBotColor,
								title: localizedText.events.joinToCreate.tempVoiceChannelTitle,
							},
						],
						components: [await createTempChannelSettings(localizedText)],
					};

					await createdVoiceChannel.send(embedMessage);
				}
			}
		}
	},
};
