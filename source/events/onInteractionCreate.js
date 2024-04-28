const { Events, ChatInputCommandInteraction } = require('discord.js');
const { onwerId } = require('@config/botConfig.json');
const { getColor } = require('@functions/utils/general/getColor');
const { getLocalizedText } = require('@functions/locale/getLocale');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		const { customId, user } = interaction;
		const { id: userId } = user;
		const { modals, buttons, selectMenus } = client;
		const isChatInputCommand = interaction.isChatInputCommand();
		const isModalSubmit = interaction.isModalSubmit();
		const isButton = interaction.isButton();
		const isStringSelectMenu = interaction.isStringSelectMenu();

		const locale = await getLocalizedText(interaction);

		switch (true) {
			case isChatInputCommand:
				const command = interaction.client.commands.get(
					interaction.commandName
				);

				if (!command) return;

				const developerOnlyMessage = locale.events.developerOnly;
				const defaultBotColor = getColor('default');
				if (command.developer && userId !== onwerId) {
					return interaction.reply({
						embeds: [
							{ color: defaultBotColor, description: developerOnlyMessage },
						],
						ephemeral: true,
					});
				}

				await command.execute(interaction, client);
				break;

			case isModalSubmit:
				const modal = modals.get(customId);
				if (modal) await modal.execute(interaction, client);
				break;

			case isButton:
				const button = buttons.get(customId);
				if (button) await button.execute(interaction, client);
				break;

			case isStringSelectMenu:
				const selectMenu = selectMenus.get(customId);
				if (selectMenu) await selectMenu.execute(interaction, client);
				break;
		}
	},
};
