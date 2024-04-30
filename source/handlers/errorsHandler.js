const { Client } = require('discord.js');
const en = require('@config/languages/en.json');
const kleur = require('kleur');

/**
 * @param {Client} client
 */
module.exports = async client => {
	process.on('unhandledRejection', (reason, promise) => {
		console.error(kleur.red(en.logs.unhandledRejection));
		console.error(reason);
	});

	process.on('uncaughtException', error => {
		console.error(kleur.red(en.logs.uncaughtException));
		console.error(error);
	});
};
