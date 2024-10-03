const {
	createLeaveCardMessage,
} = require('@functions/canvases/createLeaveCardMessage');
const {
	createWelcomeCardMessage,
} = require('@functions/canvases/createWelcomeCardMessage');

const handleMemberEvent = async (member, eventType) => {
	const { guild, user } = member;
	const { channels, client } = guild;

	if (user.bot) return;

	const channelSchema = client.models.get(`${eventType}Channel`);
	const channelData = await channelSchema.findOne({
		guildId: guild.id,
	});

	if (!channelData) return;

	const interactionChannel = channels.cache.get(channelData.channelId);

	if (!interactionChannel) return;

	const createMessageCanvas =
		eventType === 'welcome' ? createWelcomeCardMessage : createLeaveCardMessage;
	const messageCanvas = await createMessageCanvas(member);

	await interactionChannel.send({ files: [messageCanvas] });
};

module.exports = { handleMemberEvent };
