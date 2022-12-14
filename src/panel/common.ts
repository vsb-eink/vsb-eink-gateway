import TypedArray = NodeJS.TypedArray;

export const enum PanelMessageType {
	// 0-7 are reserved for basic device messages
	NOOP = 0,
	REBOOT = 1,
	// 8-31 are reserved for system messages
	PERFORM_OTA_UPDATE = 8,
	CONFIG_SET_SSID = 9,
	CONFIG_SET_PASSWORD = 10,
	CONFIG_SET_WEBSOCKET_URL = 11,
	// 32-63 are reserved for bitmap messages
	DRAW_BITMAP_1BIT = 32,
	DRAW_BITMAP_3BIT = 33,
}

type ShortnameOf<T extends TypedArray> = T extends Uint8Array
	? 'uint8'
	: T extends Uint16Array
	? 'uint16'
	: T extends Uint32Array
	? 'uint32'
	: never;

export class MessageBufferView<DataType extends TypedArray = Uint8Array> {
	private readonly _buffer: ArrayBuffer;
	private readonly _header: Uint32Array;

	readonly data: DataType;

	get header() {
		return this._header[0];
	}

	set header(value: number) {
		this._header[0] = value;
	}

	constructor(buffer: ArrayBuffer, dataType: ShortnameOf<DataType>) {
		this._buffer = buffer;
		this._header = new Uint32Array(buffer, 0, 1);

		switch (dataType) {
			case 'uint8':
				// TODO: figure out why this is necessary
				// @ts-expect-error
				this.data = new Uint8Array(buffer, this._header.byteLength);
				break;
			case 'uint16':
				// TODO: figure out why this is necessary
				// @ts-expect-error
				this.data = new Uint16Array(buffer, this._header.byteLength);
				break;
			case 'uint32':
				// TODO: figure out why this is necessary
				// @ts-expect-error
				this.data = new Uint32Array(buffer, this._header.byteLength);
				break;
			default:
				throw new Error(`Unsupported data type: ${dataType}`);
		}
	}
}

export class PanelMessage<DataType extends TypedArray = Uint8Array> {
	readonly buffer: ArrayBuffer;
	readonly view: MessageBufferView<DataType>;

	constructor(dataLength: number, dataType: ShortnameOf<DataType>) {
		this.buffer = createMessageBuffer(dataLength);
		this.view = new MessageBufferView(this.buffer, dataType);
	}
}

export interface MessageBufferEncoder {
	(bufferView: MessageBufferView): ArrayBuffer;
}

export function createMessageBuffer(dataLength: number): ArrayBuffer {
	// 4 bytes for the header, ${dataLength} bytes for data
	return new ArrayBuffer(4 + dataLength);
}
