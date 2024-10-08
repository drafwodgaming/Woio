const { Events, ActivityType } = require('discord.js');
const { monoDB, monoDBTest } = require('@config/botConfig.json');
const mongoose = require('mongoose');
const en = require('@config/languages/en.json');
const kleur = require('kleur');
const { checkAllGuilds } = require('@functions/utils/ready/checkAllGuilds');
const { registerFonts } = require('@functions/utils/canvas/registerFonts');

// const { sendEmbed } = require('@functions/owner/sendEmbed');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		mongoose.set('strictQuery', false);
		await mongoose
			.connect(monoDBTest)
			.then(() =>
				console.log(
					kleur.blue(en.logs.succesMongoDBTitle),
					kleur.black(en.logs.dbConnected)
				)
			)
			.catch(error => console.log(kleur.red(en.logs.error), error));

		client.user.setActivity({
			type: ActivityType.Custom,
			name: 'customStatus',
			state: '🧩 LetsGo!',
		});

		const clientStats = [
			{
				Name: client.user.tag,
				Servers: client.guilds.cache.size,
				Channels: client.channels.cache.size,
			},
		];
		console.table(clientStats);
		checkAllGuilds(client);
		await registerFonts();
	},
};
