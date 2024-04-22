const mustache = require('mustache');

const formatActivityLink = (interaction, localization, activity, index) => {
	const {
		name,
		description,
		acceptedPlayers,
		maxPlayersCount,
		channelId,
		messageId,
	} = activity;

	const playersInfo = `${acceptedPlayers.length}/${maxPlayersCount}`;

	const formattedName = mustache.render(
		localization.commands.activity.searchActivity.nameLabel,
		{ name }
	);
	const formattedDescription = mustache.render(
		localization.commands.activity.searchActivity.descriptionLabel,
		{ description }
	);
	const formattedPlayers = mustache.render(
		localization.commands.activity.searchActivity.playersCountLabel,
		{ playersInfo }
	);

	const linkText = `${
		index + 1
	}. ${formattedName} | ${formattedDescription} | ${formattedPlayers}`;

	const activityLink = `**[${linkText}](https://discord.com/channels/${interaction.guild.id}/${channelId}/${messageId})**`;

	return activityLink;
};

module.exports = { formatActivityLink };
