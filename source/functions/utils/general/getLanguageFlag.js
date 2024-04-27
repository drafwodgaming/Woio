const emojis = require('@config/emojis.json');

const getLanguageFlag = languageCode => {
	const languageFlags = {
		en: emojis.englishFlag,
		ru: emojis.russianFlag,
		uk: emojis.ukraineFlag,
	};

	return languageFlags[languageCode] || languageCode;
};

module.exports = { getLanguageFlag };
