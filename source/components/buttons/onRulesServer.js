const { buttons } = require('@config/componentsId.json');
const { generateRulesEmbed } = require('@functions/owner/generateRulesEmbed');

module.exports = {
	data: {
		name: buttons.rulesButton,
	},
	async execute(interaction) {
		interaction.reply({ embeds: generateRulesEmbed(), ephemeral: true });
	},
};
