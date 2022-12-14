import { PanelMessage, PanelMessageType } from '../common.js';
import { encodeText } from '../../utils/encoder.js';

export class SetWifiPasswordMessage extends PanelMessage {
	constructor(password: string) {
		const dataBuffer = encodeText(password);

		super(dataBuffer.byteLength, 'uint8');

		this.view.header = PanelMessageType.CONFIG_SET_PASSWORD;
		this.view.data.set(dataBuffer);
	}
}

export class SetWifiSsidMessage extends PanelMessage {
	constructor(ssid: string) {
		const dataBuffer = encodeText(ssid);

		super(dataBuffer.byteLength, 'uint8');

		this.view.header = PanelMessageType.CONFIG_SET_SSID;
		this.view.data.set(dataBuffer);
	}
}

export class SetWebsocketUrlMessage extends PanelMessage {
	constructor(url: string) {
		const dataBuffer = encodeText(url);

		super(dataBuffer.byteLength, 'uint8');

		this.view.header = PanelMessageType.CONFIG_SET_WEBSOCKET_URL;
		this.view.data.set(dataBuffer);
	}
}
