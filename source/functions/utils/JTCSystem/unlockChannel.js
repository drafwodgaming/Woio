const unlockChannel = async (interaction, schema, locale) => {
	const { guild, user } = interaction;
	const { id: guildId, roles: { everyone: everyoneRole } = {} } = guild;
	const { id: creatorId } = user;

	const update = { $set: { isLocked: false } };

	await Promise.all([
		await schema.findOneAndUpdate({ guildId, creatorId }, update, {
			upsert: true,
		}),
		interaction.deferUpdate(),
	]);

	const successMessage =
		locale?.components?.menus?.tempChannel?.unlockChannel?.successUnlock;
	if (successMessage)
		await interaction.followUp({ content: successMessage, ephemeral: true });

	const channel = await schema.findOne({ guildId, creatorId });

	if (channel) {
		const { channelId } = channel;
		const voiceChannel = guild.channels.cache.get(channelId);

		if (voiceChannel)
			voiceChannel.permissionOverwrites.edit(everyoneRole, { Connect: true });
	}
};

module.exports = { unlockChannel };
