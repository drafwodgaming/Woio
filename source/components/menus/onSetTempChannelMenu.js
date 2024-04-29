const { menus } = require('@config/componentsId.json');
const {
	createTempChannelNameModal,
} = require('@functions/modals/createTempChannelNameModal');
const {
	createTempChannelLimitModal,
} = require('@functions/modals/createTempChannelLimitModal');
const {
	createTempChannelSettings,
} = require('@functions/menus/createTempChannelSettings');
const { lockChannel } = require('@functions/utils/JTCSystem/lockChannel');
const { unlockChannel } = require('@functions/utils/JTCSystem/unlockChannel');
const { getLocalizedText } = require('@functions/locale/getLocale');

module.exports = {
	data: { name: menus.settingTempChannel },
	async execute(interaction) {
		const { guild, user, message } = interaction;
		const { id: guildId } = guild;
		const { id: userId } = user;
		const locale = await getLocalizedText(interaction);
		const temporaryChannelsSchema =
			interaction.client.models.get('temporaryChannels');

		const existingChannel = await temporaryChannelsSchema.findOne({
			guildId,
			creatorId: userId,
		});

		const selectedValue = interaction.values[0];

		if (
			!existingChannel ||
			(message && message.id !== existingChannel.messageId)
		) {
			await interaction.reply({
				content: locale.components.menus.tempChannel.noCreate,
				ephemeral: true,
			});
			return;
		}

		switch (selectedValue) {
			case menus.values.tempChannelName:
				await interaction.showModal(await createTempChannelNameModal(locale));
				break;
			case menus.values.tempChannelLimit:
				await interaction.showModal(await createTempChannelLimitModal(locale));
				break;
			case menus.values.tempChannelLock:
				await lockChannel(interaction, temporaryChannelsSchema, locale);
				break;
			case menus.values.tempChannelUnlock:
				await unlockChannel(interaction, temporaryChannelsSchema, locale);
				break;
		}

		await interaction.editReply({
			components: [await createTempChannelSettings(locale)],
		});
	},
};
