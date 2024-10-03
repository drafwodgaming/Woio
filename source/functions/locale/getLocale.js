const {
	getGuildLanguage
} = require('@functions/utils/general/getGuildLanguage');

const getLocalizedText = async interaction => {
	const { client, guild, user } = interaction;
	const localeSchema = interaction.client.models.get('serverLocale');
	const id = guild?.id || user.id;

	const localeCode = await getGuildLanguage(id, localeSchema);

	return interaction.client.languages.get(localeCode);
};

module.exports = { getLocalizedText };
