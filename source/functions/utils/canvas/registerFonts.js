const { registerFont } = require('canvas');
const { fonts } = require('@config/botConfig.json');

async function registerFonts() {
	registerFont(fonts.luckiestGuyRegular.path, {
		family: fonts.luckiestGuyRegular.family,
	});
}

module.exports = { registerFonts };
