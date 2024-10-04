const lockChannel = async (interaction, schema, locale) => {
	await interaction.deferUpdate();

	const { guild, user } = interaction;
	const {
		id: guildId,
		roles: { everyone },
	} = guild;
	const { id: creatorId } = user;

	const updatedChannel = await schema.findOneAndUpdate(
		{ guildId, creatorId },
		{ $set: { lockStatus: 'locked' } },
		{ upsert: true }
	);

	const successMessage =
		locale?.components?.menus?.tempChannel?.lockChannel?.successLock;

	if (successMessage)
		await interaction.followUp({ content: successMessage, ephemeral: true });

	if (updatedChannel) {
		const { channelId } = updatedChannel;
		const voiceChannel = guild.channels.cache.get(channelId);

		if (voiceChannel)
			voiceChannel.permissionOverwrites.edit(everyone, { Connect: false });
	}
};

module.exports = { lockChannel };
