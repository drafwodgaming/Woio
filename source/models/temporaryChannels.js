const { Schema, model } = require('mongoose');

const temporaryChannels = new Schema(
	{
		guildId: {
			type: String,
			required: true,
			index: true,
		},
		channelId: {
			type: String,
			required: true,
			index: true,
		},
		creatorId: {
			type: String,
			required: true,
		},
		channelName: {
			type: String,
			required: true,
		},
		userLimit: {
			type: Number,
		},
		renameTime: {
			type: Number,
			default: 0,
		},
		lockStatus: {
			type: String,
			enum: ['locked', 'unlocked'],
			default: 'unlocked',
		},
		messageId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model('TemporaryChannels', temporaryChannels);
