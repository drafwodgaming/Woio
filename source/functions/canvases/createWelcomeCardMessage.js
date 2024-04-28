const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { fonts, colors } = require('@config/botConfig.json');
const { drawRoundedRect } = require('@functions/utils/canvas/drawRoundRect');

// Функция для создания изображения прощания
const createWelcomeCardMessage = async member => {
	const { green, emerald, raisinBlack, white } = colors.canvas;
	const { luckiestGuyRegular } = fonts;

	const { user } = member;
	const { username } = user;
	const avatarURL = user.displayAvatarURL({ extension: 'jpg' });

	const canvasWidth = 1024;
	const canvasHeight = 450;
	const canvas = createCanvas(canvasWidth, canvasHeight);
	const context = canvas.getContext('2d');

	const fontSize = 43;
	const fontFamily = luckiestGuyRegular.family;

	const leftRectX = 118.5;
	const leftRectY = 21;
	const leftRectWidth = canvasWidth / 2 - leftRectX;
	const leftRectHeight = canvasHeight * 0.75 - leftRectY;
	const leftRectRadius = 26;

	const rightRectX = canvasWidth / 2;
	const rightRectY = canvasHeight - leftRectHeight - 20;
	const rightRectWidth = canvasWidth - leftRectX - rightRectX;
	const rightRectHeight = canvasHeight * 0.75 - leftRectY;
	const rightRectRadius = 26;

	const centerRectX = canvasWidth / 2 - 364;
	const centerRectY = canvasHeight / 2 - 179;
	const centerRectWidth = 728;
	const centerRectHeight = 358;
	const centerRectRadius = 25;

	const textX = canvasWidth / 2;
	const textY = canvasHeight - 90;

	const avatarRadius = 100;
	const avatarX = canvasWidth / 2;
	const avatarY = canvasHeight - 270;

	context.fillStyle = green;
	drawRoundedRect({
		context,
		x: leftRectX,
		y: leftRectY,
		width: leftRectWidth,
		height: leftRectHeight,
		radius: leftRectRadius,
	});
	context.fill();

	context.fillStyle = emerald;
	drawRoundedRect({
		context,
		x: rightRectX,
		y: rightRectY,
		width: rightRectWidth,
		height: rightRectHeight,
		radius: rightRectRadius,
	});
	context.fill();

	// Создание центрального прямоугольника

	context.fillStyle = raisinBlack;
	drawRoundedRect({
		context,
		x: centerRectX,
		y: centerRectY,
		width: centerRectWidth,
		height: centerRectHeight,
		radius: centerRectRadius,
	});
	context.fill();

	// Добавление текста прощания
	const leaveMessage = `Welcome ${username}!`;

	context.textAlign = 'center';
	context.fillStyle = white;
	context.font = `${fontSize}px ${fontFamily}`;
	context.fillText(leaveMessage, textX, textY);

	// Добавление аватара пользователя
	context.beginPath();
	context.lineWidth = 10;
	context.strokeStyle = white;
	context.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
	context.stroke();
	context.clip();

	const avatarImage = await loadImage(avatarURL);
	context.drawImage(
		avatarImage,
		avatarX - avatarRadius,
		avatarY - avatarRadius,
		avatarRadius * 2,
		avatarRadius * 2
	);

	return new AttachmentBuilder(canvas.toBuffer('image/png'));
};

module.exports = { createWelcomeCardMessage };
