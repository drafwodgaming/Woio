const {
	StringSelectMenuBuilder,
	ActionRowBuilder,
	StringSelectMenuOptionBuilder,
} = require('discord.js');
const emojis = require('@config/emojis.json');
const { menus } = require('@config/componentsId.json');

const createTempChannelSettings = locale => {
	const selectorId = menus.settingTempChannel;

	const menuOptions = [
		{
			label: locale.components.menus.tempChannel.name.label,
			description: locale.components.menus.tempChannel.name.description,
			value: menus.values.tempChannelName,
			emoji: emojis.nameTag,
		},
		{
			label: locale.components.menus.tempChannel.limit.label,
			description: locale.components.menus.tempChannel.limit.description,
			value: menus.values.tempChannelLimit,
			emoji: emojis.limitPeople,
		},
		{
			label: locale.components.menus.tempChannel.lockChannel.label,
			description: locale.components.menus.tempChannel.lockChannel.description,
			value: menus.values.tempChannelLock,
			emoji: emojis.lockChannel,
		},
		{
			label: locale.components.menus.tempChannel.unlockChannel.label,
			description:
				locale.components.menus.tempChannel.unlockChannel.description,
			value: menus.values.tempChannelUnlock,
			emoji: emojis.unlockChannel,
		},
	];

	const nameMenu = new StringSelectMenuBuilder()
		.setCustomId(selectorId)
		.setPlaceholder(locale.components.menus.tempChannel.changeSettings)
		.addOptions(
			menuOptions.map(({ label, description, value, emoji }) =>
				new StringSelectMenuOptionBuilder()
					.setLabel(label)
					.setDescription(description)
					.setValue(value)
					.setEmoji(emoji)
			)
		);

	return new ActionRowBuilder().addComponents(nameMenu);
};

module.exports = { createTempChannelSettings };
