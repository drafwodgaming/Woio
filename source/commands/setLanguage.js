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
		)
		.setDMPermission(false),
	async execute(interaction) {
		const { guild, options } = interaction;
		const subCommand = options.getSubcommand();

		const selectedLocale = options.getString(enCommands.options.languageOption);
		const guildId = guild.id;

		if (subCommand !== enCommands.subcommands.setLanguage) return;

		const localeSchema = interaction.client.models.get('serverLocale');
		await localeSchema.updateOne(
			{ guildId },
			{ $set: { language: selectedLocale } },
			{ upsert: true }
		);

		const locale = await getLocalizedText(interaction);
		const languageName = getLanguageName(selectedLocale);
		const languageFlag = getLanguageFlag(selectedLocale);

		const responseContent = mustache.render(
			locale.commands.language.languageUpdated,
			{ flag: languageFlag, language: languageName }
		);

		await interaction.reply({
			content: responseContent,
			ephemeral: true,
		});
	},
};
