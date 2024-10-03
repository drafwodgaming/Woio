const { loadImage } = require('canvas');

const drawAvatar = async ({ context, avatarURL, position, radius }) => {
	context.beginPath();
	context.lineWidth = 10;
	context.strokeStyle = 'white';
	context.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
	context.stroke();
	context.clip();

	const avatarImage = await loadImage(avatarURL);
	context.drawImage(
		avatarImage,
		position.x - radius,
		position.y - radius,
		radius * 2,
		radius * 2
	);
};

module.exports = { drawAvatar };
