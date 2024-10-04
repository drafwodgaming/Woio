const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const mustache = require('mustache');
const { getLocalizedText } = require('@functions/locale/getLocale');
const { getLanguageName } = require('@functions/utils/general/getLanguageName');
const { getLanguageFlag } = require('@functions/utils/general/getLanguageFlag');

const { commands: enCommands } = require('@config/languages/en.json');
const { commands: ruCommands } = require('@config/languages/ru.json');
const { commands: ukCommands } = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(enCommands.language.name)
		.setDescription(enCommands.language.description)
		.setDescriptionLocalizations({
			ru: ruCommands.language.description,
			uk: ukCommands.language.description,
		})
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName(enCommands.subcommands.setLanguage)
				.setDescription(enCommands.language.setLanguage)
				.setDescriptionLocalizations({
					ru: ruCommands.language.setLanguage,
					uk: ukCommands.language.setLanguage,
				})
				.addStringOption(option =>
					option
						.setName(enCommands.options.languageOption)
						.setDescription(enCommands.language.chooseLanguage)
						.setDescriptionLocalizations({
							ru: ruCommands.language.chooseLanguage,
							uk: ukCommands.language.chooseLanguage,
						})
						.setRequired(true)
						.addChoices(
							{ name: 'English', value: 'en' },
							{ name: 'Русский', value: 'ru' },
							{ name: 'Українська', value: 'uk' }
						)
				)
		),

	async execute(interaction) {
		const { guild, options, client } = interaction;

		const selectedLocale = options.getString(enCommands.options.languageOption);

		if (options.getSubcommand() === enCommands.subcommands.setLanguage) {
			await client.models
				.get('serverLocale')
				.updateOne(
					{ guildId: guild.id },
					{ $set: { language: selectedLocale } },
					{ upsert: true }
				);

			const locale = await getLocalizedText(interaction);
			const responseContent = mustache.render(
				locale.commands.language.languageUpdated,
				{
					flag: getLanguageFlag(selectedLocale),
					language: getLanguageName(selectedLocale),
				}
			);

			await interaction.reply({ content: responseContent, ephemeral: true });
		}
	},
};
