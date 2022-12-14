import { PanelMessage, PanelMessageType } from '../common.js';
import { ImageData } from '../../graphics/image';
import { INKPLATE_HEIGHT, INKPLATE_WIDTH } from '../inkplate';
import { oddParity, packBits, packTribits } from '../../utils/bitwise';

export class DrawBitmap3BitMessage extends PanelMessage<Uint16Array> {
	constructor(image: ImageData) {
		super(((INKPLATE_HEIGHT * INKPLATE_WIDTH) / 5) * 2, 'uint16');

		this.view.header = PanelMessageType.DRAW_BITMAP_3BIT;

		for (let groupOffset = 0; groupOffset < this.view.data.length; ++groupOffset) {
			const pixelOffset = groupOffset * 5;

			const pixels = packTribits([
				image.data[pixelOffset],
				image.data[pixelOffset + 1],
				image.data[pixelOffset + 2],
				image.data[pixelOffset + 3],
				image.data[pixelOffset + 4],
			]);

			const parity = oddParity(pixels);

			this.view.data[groupOffset] = (pixels << 1) | parity;
		}
	}
}

export class DrawBitmap1BitMessage extends PanelMessage<Uint8Array> {
	constructor(image: ImageData) {
		super((INKPLATE_HEIGHT * INKPLATE_WIDTH) / 8, 'uint8');

		this.view.header = PanelMessageType.DRAW_BITMAP_1BIT;

		for (let groupOffset = 0; groupOffset < this.view.data.length; ++groupOffset) {
			const pixelOffset = groupOffset * 8;

			this.view.data[groupOffset] = packBits([
				image.data[pixelOffset],
				image.data[pixelOffset + 1],
				image.data[pixelOffset + 2],
				image.data[pixelOffset + 3],
				image.data[pixelOffset + 4],
				image.data[pixelOffset + 5],
				image.data[pixelOffset + 6],
				image.data[pixelOffset + 7],
			]);
		}
	}
}
