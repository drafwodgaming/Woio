const { colors } = require('@config/botConfig.json');

const getColor = colorName => {
	const colorPathSegments = colorName.split('.');
	let currentColorObject = colors;

	for (const segment of colorPathSegments) {
		currentColorObject = currentColorObject[segment];
	}

	if (currentColorObject.startsWith('rgb(')) {
		const rgbValues = currentColorObject
			.substring(4, currentColorObject.length - 1)
			.split(',')
			.map(value => parseInt(value.trim()));

		const red = rgbValues[0];
		const green = rgbValues[1];
		const blue = rgbValues[2];

		return (red << 16) + (green << 8) + blue;
	}

	throw new Error('Unsupported color format');
};

module.exports = { getColor };
