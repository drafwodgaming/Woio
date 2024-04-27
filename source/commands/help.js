const { SlashCommandBuilder, bold } = require('discord.js');
const { getColor } = require('@functions/utils/general/getColor');
const { getLocalizedText } = require('@functions/locale/getLocale');

const { commands: enCommands } = require('@config/languages/en.json');
const { commands: ruCommands } = require('@config/languages/ru.json');
const { commands: ukCommands } = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(enCommands.help.name)
		.setDescription(enCommands.help.description)
		.setDescriptionLocalizations({
			ru: ruCommands.help.description,
			uk: ukCommands.help.description,
		})
		.setDMPermission(false),
	async execute(interaction, client) {
		const locale = await getLocalizedText(interaction);
		const defaultColor = getColor('default');

		const embed = {
			color: defaultColor,
			title: locale.commands.help.title,
		};

		const description = client.commandsArray.map(
			({ name, description }) => `${bold(name)}\n${description}\n`
		);

		embed.description = description.join('');

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
