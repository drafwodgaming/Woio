const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { fonts, memberCard, colors } = require('@config/botConfig.json');
const memberCardBackground = require('@config/memberBackground.json');

async function createWelcomeCardMessage(member) {
	const { user } = member;
	const { username } = user;
	const avatarURL = user.displayAvatarURL({ extension: 'jpg' });
	const fontSize = 43;
	const canvasColor = colors.canvasWhite;

	const canvas = createCanvas(1024, 450);
	const context = canvas.getContext('2d');
	const background = await loadImage(memberCardBackground.welcome);

	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	const welcomeMessage = `Welcome ${username}!`;
	const { width, height } = canvas;
	const textX = width / 2;
	const textY = height - 90;

	context.textAlign = 'center';
	context.fillStyle = canvasColor;
	context.font = `${fontSize}px ${fonts.luckiestGuyRegular.family}`;
	context.fillText(welcomeMessage, textX, textY);

	const avatarRadius = 100;
	const avatarX = width / 2;
	const avatarY = height - 270;

	context.beginPath();
	context.lineWidth = 10;
	context.strokeStyle = colors.canvasWhite;
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
	const welcomeMessageAttachment = new AttachmentBuilder(
		canvas.toBuffer('image/png'),
		memberCard.welcome
	);

	return welcomeMessageAttachment;
}

module.exports = { createWelcomeCardMessage };
