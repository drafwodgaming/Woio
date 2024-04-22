const {
	StringSelectMenuBuilder,
	ActionRowBuilder,
	StringSelectMenuOptionBuilder,
} = require('discord.js');
const emojis = require('@config/emojis.json');
const { menus } = require('@config/componentsId.json');

const createTempChannelSettings = localization => {
	const selectorId = menus.settingTempChannel;

	const menuOptions = [
		{
			label: localization.components.menus.tempChannel.name.label,
			description: localization.components.menus.tempChannel.name.description,
			value: menus.values.tempChannelName,
			emoji: emojis.nameTag,
		},
		{
			label: localization.components.menus.tempChannel.limit.label,
			description: localization.components.menus.tempChannel.limit.description,
			value: menus.values.tempChannelLimit,
			emoji: emojis.limitPeople,
		},
		{
			label: localization.components.menus.tempChannel.lockChannel.label,
			description:
				localization.components.menus.tempChannel.lockChannel.description,
			value: menus.values.tempChannelLock,
			emoji: emojis.lockChannel,
		},
		{
			label: localization.components.menus.tempChannel.unlockChannel.label,
			description:
				localization.components.menus.tempChannel.unlockChannel.description,
			value: menus.values.tempChannelUnlock,
			emoji: emojis.unlockChannel,
		},
	];

	const nameMenu = new StringSelectMenuBuilder()
		.setCustomId(selectorId)
		.setPlaceholder(localization.components.menus.tempChannel.changeSettings)
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
