import { PanelMessage, PanelMessageType } from '../common.js';
import { encodeText } from '@/utils/encoder';

export class PerformOtaUpdateMessage extends PanelMessage {
	constructor(otaUrl: string) {
		const dataBuffer = encodeText(otaUrl);

		super(dataBuffer.byteLength, 'uint8');

		this.view.header = PanelMessageType.PERFORM_OTA_UPDATE;
		this.view.data.set(dataBuffer);
	}
}

export class RebootMessage extends PanelMessage {
	constructor() {
		super(0, 'uint8');

		this.view.header = PanelMessageType.REBOOT;
	}
}
