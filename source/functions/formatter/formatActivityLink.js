const mustache = require('mustache');

const formatActivityLink = ({ interaction, locale, activity, index }) => {
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
		locale.commands.activity.searchActivity.nameLabel,
		{ name }
	);
	const formattedDescription = mustache.render(
		locale.commands.activity.searchActivity.descriptionLabel,
		{ description }
	);
	const formattedPlayers = mustache.render(
		locale.commands.activity.searchActivity.playersCountLabel,
		{ playersInfo }
	);

	const linkText = `${
		index + 1
	}. ${formattedName} | ${formattedDescription} | ${formattedPlayers}`;

	const activityLink = `**[${linkText}](https://discord.com/channels/${interaction.guild.id}/${channelId}/${messageId})**`;

	return activityLink;
};

module.exports = { formatActivityLink };
