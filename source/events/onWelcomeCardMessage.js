const { Events } = require('discord.js');
const { handleMemberEvent } = require('@functions/events/handleMemberEvent');

module.exports = {
	name: Events.GuildMemberAdd,
	execute: member => handleMemberEvent(member, 'welcome'),
};
