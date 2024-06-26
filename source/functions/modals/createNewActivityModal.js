const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { modals } = require('@config/componentsId.json');

async function createNewActivityModal(locale, roles) {
	const componentsData = [
		{
			id: modals.activityTitle,
			label: locale.components.modals.newActivity.activityTitleInput.label,
			style: TextInputStyle.Short,
			placeholder:
				locale.components.modals.newActivity.activityTitleInput.placeholder,
			minLength: 1,
			maxLength: 50,
		},
		{
			id: modals.activityDescription,
			label: locale.components.modals.newActivity.activityDescription.label,
			style: TextInputStyle.Paragraph,
			placeholder:
				locale.components.modals.newActivity.activityDescription.placeholder,
			minLength: 1,
			maxLength: 1000,
		},
		{
			id: modals.activityPlayersCount,
			label: locale.components.modals.newActivity.activityPlayersCount.label,
			style: TextInputStyle.Short,
			placeholder:
				locale.components.modals.newActivity.activityPlayersCount.placeholder,
			minLength: 1,
			maxLength: 1,
		},
		{
			id: modals.roleId,
			label: locale.components.modals.newActivity.activityPingRole.label,
			style: TextInputStyle.Short,
			placeholder: '',
			minLength: 1,
			maxLength: 1000,
			value: roles.id,
		},
	];

	const newActivityModal = new ModalBuilder()
		.setCustomId(modals.newActivity)
		.setTitle(locale.components.modals.newActivity.title);

	componentsData.forEach(
		({ id, label, style, placeholder, minLength, maxLength, value }) => {
			const inputField = new TextInputBuilder()
				.setCustomId(id)
				.setLabel(label)
				.setStyle(style)
				.setPlaceholder(placeholder || '')
				.setMinLength(minLength)
				.setMaxLength(maxLength);

			if (value !== undefined) inputField.setValue(value);

			const row = new ActionRowBuilder().addComponents(inputField);
			newActivityModal.addComponents(row);
		}
	);

	return newActivityModal;
}

module.exports = { createNewActivityModal };
