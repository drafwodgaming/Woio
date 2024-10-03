const drawText = ({ context, text, position, fontSize, fontFamily, color }) => {
	context.textAlign = 'center';
	context.fillStyle = color;
	context.font = `${fontSize}px ${fontFamily}`;
	context.fillText(text, position.x, position.y);
};

module.exports = { drawText };
