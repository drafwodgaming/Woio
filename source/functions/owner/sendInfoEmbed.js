const { generateInfoEmbed } = require('@functions/owner/generateInfoEmbed');
const { createRulesButtons } = require('@functions/buttons/createRulesButtons');
const { infoChannelId } = require('@config/botConfig.json');

const sendInfoEmbed = async client => {
	const channel = await client.channels.fetch(infoChannelId);

	await channel.send({
		embeds: [generateInfoEmbed()],
		components: [createRulesButtons()],
	});
};

module.exports = { sendInfoEmbed };
