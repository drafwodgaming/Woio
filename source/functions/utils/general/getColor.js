const { colors } = require('@config/botConfig.json');

const getColor = colorName => {
	const colorPathSegments = colorName.split('.');
	let currentColorObject = colors;

	for (const segment of colorPathSegments) {
		currentColorObject = currentColorObject[segment];
	}

	return parseInt(currentColorObject);
};

module.exports = { getColor };
