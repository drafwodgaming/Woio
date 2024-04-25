const {
	createLeaveCardMessage,
} = require('@functions/canvases/createLeaveCardMessage');
const {
	createWelcomeCardMessage,
} = require('@functions/canvases/createWelcomeCardMessage');

const handleMemberEvent = async (member, eventType) => {
	const { guild, user } = member;
	const { channels, client } = guild;
	const channelCache = channels.cache;

	const channelSchema = client.models.get(`${eventType}Channel`);
	const { channelId: interactionChannelId } = await channelSchema.findOne({
		guildId: guild.id,
	});

	if (!interactionChannelId) return;

	const interactionChannel = channelCache.find(
		channel => channel.id === interactionChannelId
	);

	if (user.bot || !interactionChannel) return;

	const createMessageCanvas =
		eventType === 'welcome' ? createWelcomeCardMessage : createLeaveCardMessage;
	const messageCanvas = await createMessageCanvas(member);

	await interactionChannel.send({ files: [messageCanvas] });
};

module.exports = { handleMemberEvent };
