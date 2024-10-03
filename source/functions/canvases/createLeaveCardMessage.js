const { AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('canvas');
const { fonts, colors } = require('@config/botConfig.json');
const { fillRoundedRect } = require('@functions/utils/canvas/fillRoundedRect');
const { drawAvatar } = require('@functions/utils/canvas/drawAvatar');
const { drawText } = require('@functions/utils/canvas/drawText');
const createLeaveCardMessage = async member => {
	const { crimson, bittersweet, raisinBlack, white } = colors.canvas;
	const { luckiestGuyRegular } = fonts;

	const canvasSize = { width: 1024, height: 450 };
	const canvas = createCanvas(canvasSize.width, canvasSize.height);
	const context = canvas.getContext('2d');

	// Рисование фона
	fillRoundedRect({
		context,
		rectInfo: {
			x: 118.5,
			y: 21,
			width: canvasSize.width / 2 - 118.5,
			height: canvasSize.height * 0.75 - 21,
			radius: 26,
		},
		color: crimson,
	});

	fillRoundedRect({
		context,
		rectInfo: {
			x: canvasSize.width / 2,
			y: canvasSize.height - (canvasSize.height * 0.75 - 21) - 20,
			width: canvasSize.width - 118.5 - canvasSize.width / 2,
			height: canvasSize.height * 0.75 - 21,
			radius: 26,
		},
		color: bittersweet,
	});

	fillRoundedRect({
		context,
		rectInfo: {
			x: canvasSize.width / 2 - 364,
			y: canvasSize.height / 2 - 179,
			width: 728,
			height: 358,
			radius: 25,
		},
		color: raisinBlack,
	});

	// Рисование текста прощания
	drawText({
		context,
		text: `Goodbye ${member.user.username}!`,
		position: { x: canvasSize.width / 2, y: canvasSize.height - 90 },
		fontSize: 43,
		fontFamily: luckiestGuyRegular.family,
		color: white,
	});

	// Рисование аватара пользователя
	await drawAvatar({
		context,
		avatarURL: member.user.displayAvatarURL({ extension: 'jpg' }),
		position: { x: canvasSize.width / 2, y: canvasSize.height - 270 },
		radius: 100,
	});

	return new AttachmentBuilder(canvas.toBuffer('image/png'));
};

module.exports = { createLeaveCardMessage };
