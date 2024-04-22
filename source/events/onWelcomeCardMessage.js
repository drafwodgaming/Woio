const { Events } = require('discord.js');
const {
	createWelcomeCardMessage,
} = require('@functions/canvases/createWelcomeCardMessage');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		const { guild, user } = member;
		const channelsCache = guild.channels.cache;
		const welcomeChannelSchema = member.client.models.get('welcomeChannel');

		const interactionChannelId = await welcomeChannelSchema.findOne({
			guildId: guild.id,
		});

		if (!interactionChannelId) return;

		const welcomeChannel = channelsCache.find(
			channel => channel.id === interactionChannelId.channelId
		);

		if (user.bot || !welcomeChannel) return;

		const welcomeMessageCanvas = await createWelcomeCardMessage(member);
		await welcomeChannel.send({ files: [welcomeMessageCanvas] });
	},
};
