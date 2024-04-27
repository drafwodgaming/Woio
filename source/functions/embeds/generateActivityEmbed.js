const generateActivityEmbed = ({
	title,
	description,
	creatorId,
	participants,
	maxPlayers,
	creatorFieldName,
	participantsFieldName,
	embedColor,
	ownerAvatarUrl,
}) => ({
	title,
	description,
	fields: [
		{ name: creatorFieldName, value: `<@${creatorId}>`, inline: true },
		{
			name: `${participantsFieldName} (${participants.length}/${maxPlayers})`,
			value: participants.map(id => `<@${id}>`).join('\n'),
			inline: true,
		},
	],
	color: embedColor,
	thumbnail: { url: ownerAvatarUrl },
});

module.exports = { generateActivityEmbed };
