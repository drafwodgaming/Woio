const { drawRoundedRect } = require('@functions/utils/canvas/drawRoundRect');

const fillRoundedRect = ({ context, rectInfo, color }) => {
	context.fillStyle = color;
	drawRoundedRect({
		context,
		...rectInfo,
	});
	context.fill();
};

module.exports = { fillRoundedRect };
