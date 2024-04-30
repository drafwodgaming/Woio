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
		const { member } = oldState || newState;
		const { guild, user, client } = member;
		const { id: guildId } = guild;
		const { username } = user;

		const [joinToCreateData, temporaryChannels] = await Promise.all([
			client.models.get('joinToCreate').findOne({ guildId }),
			client.models.get('temporaryChannels'),
		]);

		if (!joinToCreateData) return;

		const interactionChannelId = joinToCreateData.channelId;

		if (interactionChannelId !== newState.channelId) return;

		const parentCategory = newState.channel?.parent;
		const locale = await getLocalizedText(member);
		const channelName = mustache.render(
			locale.events.joinToCreate.channelName,
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

			if (createdVoiceChannel) {
				newState.setChannel(createdVoiceChannel);

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
