const { modals } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');

module.exports = {
	data: {
		name: modals.tempChannelLimit,
	},
	async execute(interaction) {
		const { client, guild, user } = interaction;
		const { id: guildId } = guild;
		const { id: memberId } = user;
		await interaction.deferUpdate();
		const newUserLimit = parseInt(
			interaction.fields.getTextInputValue(modals.tempChannelLimitInput)
		);
		const temporaryChannelsSchema = client.models.get('temporaryChannels');

		const locale = await getLocalizedText(interaction);

		if (isNaN(newUserLimit) || newUserLimit < 0 || newUserLimit > 99) {
			return await interaction.followUp({
				content: locale.components.modals.setLimitTempChannel.errorInvalidLimit,
				ephemeral: true,
			});
		}

		const updatedChannel = await temporaryChannelsSchema.findOneAndUpdate(
			{ guildId, creatorId: memberId },
			{ $set: { userLimit: newUserLimit } },
			{ upsert: true }
		);

		if (updatedChannel) {
			const voiceChannel = guild.channels.cache.get(updatedChannel.channelId);
			if (voiceChannel) await voiceChannel.setUserLimit(newUserLimit);
		}

		await interaction.followUp({
			content: locale.components.modals.setLimitTempChannel.successMessage,
			ephemeral: true,
		});
	},
};
