const { Events } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	execute: async newState => {
		const { guild } = newState;
		const { client, id: guildId, channels } = guild;

		const temporaryChannelsSchema = client.models.get('temporaryChannels');
		const tempChannels = await temporaryChannelsSchema.find({
			guildId,
		});

		for (const tempChannel of tempChannels) {
			const { channelId, creatorId } = tempChannel;
			const channel = channels.cache.get(channelId);

			if (channel && channel.members.size === 0) {
				await channel.delete();
				await temporaryChannelsSchema.deleteMany({ guildId, creatorId });
			}
		}
	},
};
