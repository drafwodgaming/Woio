const mustache = require('mustache');
const emojis = require('@config/emojis.json');

const getStatusText = (status, locale) => {
	const onlineEmoji = emojis.online;
	const idleEmoji = emojis.idle;
	const dndEmoji = emojis.dnd;
	const offlineEmoji = emojis.offline;
	const unknownEmoji = emojis.unknown;
	const invisibleEmoji = emojis.invisible;

	switch (status) {
		case 'online':
			return mustache.render(locale.commands.userInfo.online, {
				onlineEmoji,
			});
		case 'idle':
			return mustache.render(locale.commands.userInfo.idle, {
				idleEmoji,
			});
		case 'dnd':
			return mustache.render(locale.commands.userInfo.dnd, {
				dndEmoji,
			});
		case 'invisible':
			return mustache.render(locale.commands.userInfo.invisible, {
				invisibleEmoji,
			});
		case 'offline':
			return mustache.render(locale.commands.userInfo.offline, {
				offlineEmoji,
			});
		default:
			return mustache.render(locale.commands.userInfo.unknown, {
				unknownEmoji,
			});
	}
};

module.exports = { getStatusText };
