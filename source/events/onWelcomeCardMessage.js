const { Events } = require('discord.js');
const { handleMemberEvent } = require('@functions/events/handleMemberEvent');

module.exports = {
	name: Events.GuildMemberAdd,
	execute: async member => await handleMemberEvent(member, 'welcome'),
};
