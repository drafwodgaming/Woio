const {
	getGuildLanguage,
} = require('@functions/utils/general/getGuildLanguage');

const getLocalizedText = async interaction => {
	const localeSchema = interaction.client.models.get('serverLocale');
	const id = interaction.guild?.id || interaction.user.id;

	const localeCode = await getGuildLanguage(id, localeSchema);

	return interaction.client.languages.get(localeCode);
};

module.exports = { getLocalizedText };
