const { getColor } = require('@functions/utils/general/getColor');
const ru = require('@config/languages/ru.json');

const generateInfoEmbed = () => {
	const defaultBotColor = getColor('default');
	const embed = {
		color: defaultBotColor,
		title: ru.myServer.embeds.infoAboutServer.title,
		description: ru.myServer.embeds.infoAboutServer.description,
		fields: [
			{
				name: '',
				value: ru.myServer.embeds.infoAboutServer.fields.links,
			},
		],
	};

	return embed;
};
module.exports = { generateInfoEmbed };
