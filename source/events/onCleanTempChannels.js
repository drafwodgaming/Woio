const { Events } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	execute: async newState => {
		const { guild } = newState;

		const temporaryChannelsSchema =
			guild.client.models.get('temporaryChannels');
		const tempChannels = await temporaryChannelsSchema.find({
			guildId: guild.id,
		});

		for (const tempChannel of tempChannels) {
			const { channelId, creatorId } = tempChannel;
			const channel = guild.channels.cache.get(channelId);
			const guildId = guild.id;

			if (channel && channel.members.size === 0) {
				await channel.delete();
				await temporaryChannelsSchema.deleteMany({ guildId, creatorId });
			}
		}
	},
};
