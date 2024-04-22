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
		const guildId = interaction.guild.id;
		const memberId = interaction.user.id;
		const localizedText = await getLocalizedText(interaction);
		const temporaryChannelsSchema =
			interaction.client.models.get('temporaryChannels');

		const existingChannel = await temporaryChannelsSchema.findOne({
			guildId,
			creatorId: memberId,
		});

		if (!existingChannel) {
			await interaction.deferUpdate();
			await interaction.followUp({
				content: localizedText.components.menus.tempChannel.noCreate,
				ephemeral: true,
			});
			await interaction.editReply({
				components: [await settingsTempChannel(interaction)],
			});
		}
		const selectedValue = interaction.values[0];

		switch (selectedValue) {
			case menus.values.tempChannelName:
				await interaction.showModal(
					await createTempChannelNameModal(localizedText)
				);
				break;
			case menus.values.tempChannelLimit:
				await interaction.showModal(
					await createTempChannelLimitModal(localizedText)
				);
				break;
			case menus.values.tempChannelLock:
				await lockChannel(interaction, temporaryChannelsSchema, localizedText);
				break;
			case menus.values.tempChannelUnlock:
				await unlockChannel(
					interaction,
					temporaryChannelsSchema,
					localizedText
				);
				break;
		}

		await interaction.editReply({
			components: [await createTempChannelSettings(localizedText)],
		});
	},
};
