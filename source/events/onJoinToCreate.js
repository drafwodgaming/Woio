const { Events } = require('discord.js');
const { createVoiceChannel } = require('@functions/utils/createVoiceChannel');
const {
	createTempChannelSettings,
} = require('@functions/menus/createTempChannelSettings');
const { getColor } = require('@functions/utils/general/getColor');
const { getLocalizedText } = require('@functions/locale/getLocale');
const mustache = require('mustache');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		if (!oldState.channelId && newState.channelId) {
			const { member } = newState;
			const { guild, user, client } = member;
			const guildId = guild.id;

			// Получаем данные о канале для создания
			const joinToCreateData = await client.models
				.get('joinToCreate')
				.findOne({ guildId });
			if (
				!joinToCreateData ||
				joinToCreateData.channelId !== newState.channelId
			)
				return;

			const parentCategory = newState.channel?.parent;
			const locale = await getLocalizedText(member);
			const channelName = mustache.render(
				locale.events.joinToCreate.channelName,
				{ username: user.username }
			);

			const temporaryChannels = client.models.get('temporaryChannels');
			const existingChannel = await temporaryChannels.findOne({
				guildId,
				channelId: newState.channelId,
			});

			if (!existingChannel) {
				const createdVoiceChannel = await createVoiceChannel(
					guild,
					member,
					channelName,
					0,
					parentCategory
				);
				if (!createdVoiceChannel) return;

				await newState.setChannel(createdVoiceChannel);

				const defaultBotColor = getColor('default');
				const embedMessage = {
					embeds: [
						{
							color: defaultBotColor,
							title: locale.events.joinToCreate.tempVoiceChannelTitle,
						},
					],
					components: [await createTempChannelSettings(locale)],
				};

				const createdMessage = await createdVoiceChannel.send(embedMessage);

				await temporaryChannels.findOneAndUpdate(
					{ guildId, channelId: createdVoiceChannel.id },
					{
						$set: {
							creatorId: member.id,
							channelName,
							messageId: createdMessage.id,
						},
					},
					{ upsert: true }
				);
			}
		}
	},
};
