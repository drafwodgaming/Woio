const { buttons } = require('@config/componentsId.json');
const { getColor } = require('@functions/utils/general/getColor');
const { getLocalizedText } = require('@functions/locale/getLocale');

module.exports = {
	data: {
		name: buttons.sendReport,
	},
	async execute(interaction, client) {
		const { message } = interaction;
		const successColor = getColor('succesGreen');
		const locale = await getLocalizedText(interaction);

		if (message) {
			const copiedContent = {
				embeds: message.embeds,
			};

			const channelId = '1220052563236487239';
			const reportChannel = await client.channels.fetch(channelId);

			const embed = {
				color: successColor,
				description: locale.commands.report.succesSendReport,
			};
			await interaction.reply({ embeds: [embed], ephemeral: true });
			await reportChannel.send(copiedContent);
		}
	},
};
