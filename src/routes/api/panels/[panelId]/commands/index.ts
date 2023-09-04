import { TypedFastifyPluginAsync } from '@/routes/api';
import { ParamsSchema } from '@/routes/api/panels/[panelId]/types';
import { sendMessageToPanel } from '@/services/panels';
import { PerformOtaUpdateMessage, RebootMessage } from '@/panel/messages/system';
import {
	SetWebsocketUrlMessage,
	SetWifiPasswordMessage,
	SetWifiSsidMessage,
} from '@/panel/messages/config';
import { floydSteinberg } from '@/graphics/dither';
import sharp from 'sharp';
import { INKPLATE_HEIGHT, INKPLATE_WIDTH } from '@/panel/inkplate';
import { createLinearQuantiser } from '@/graphics/quantise';
import { ImageData } from '@/graphics/image';
import { changeDepth } from '@/graphics/depth';
import { DrawBitmap1BitMessage, DrawBitmap3BitMessage } from '@/panel/messages/bitmap';

export const commands: TypedFastifyPluginAsync = async function (app) {
	app.post(
		'/reboot',
		{
			schema: {
				params: ParamsSchema,
				response: {
					202: {},
				},
			},
		},
		async function (req, res) {
			await sendMessageToPanel(req.params.panelId, new RebootMessage());
		}
	);

	app.post(
		'/ota',
		{
			schema: {
				params: ParamsSchema,
				body: {
					type: 'object',
					properties: {
						url: { type: 'string', format: 'uri' },
					},
					required: ['url'],
				},
				response: {
					202: {},
				},
			},
		} as const,
		async function (req, res) {
			await sendMessageToPanel(req.params.panelId, new PerformOtaUpdateMessage(req.body.url));
		}
	);

	app.post(
		'/config',
		{
			schema: {
				params: ParamsSchema,
				body: {
					type: 'object',
					properties: {
						ssid: { type: 'string' },
						password: { type: 'string' },
						websocketUrl: { type: 'string', format: 'uri' },
					},
				},
				response: {
					202: {},
				},
			},
		} as const,
		async function (req, res) {
			if (req.body.ssid) {
				await sendMessageToPanel(req.params.panelId, new SetWifiSsidMessage(req.body.ssid));
			}

			if (req.body.password) {
				await sendMessageToPanel(
					req.params.panelId,
					new SetWifiPasswordMessage(req.body.password)
				);
			}

			if (req.body.websocketUrl) {
				await sendMessageToPanel(
					req.params.panelId,
					new SetWebsocketUrlMessage(req.body.websocketUrl)
				);
			}
		}
	);

	app.post(
		'/display',
		{
			schema: {
				params: ParamsSchema,
				body: {
					type: 'object',
					properties: {
						image: {
							oneOf: [
								{ type: 'string', format: 'url' },
								{
									type: 'string',
									pattern:
										'^data:image/(png|jpeg|jpg|webp|gif|avif|tiff);base64,',
								},
							],
						},
						mode: { type: 'string', enum: ['1bit', '3bit'] },
					},
					required: ['image', 'mode'],
				},
				response: {
					202: {},
				},
			},
		} as const,
		async function (req, res) {
			const image = await fetch(req.body.image).then((res) => res.arrayBuffer());
			const pixelBuffer = await sharp(Buffer.from(image))
				.resize({
					width: INKPLATE_WIDTH,
					height: INKPLATE_HEIGHT,
					fit: 'contain',
					background: '#ffffff',
				})
				.toColorspace('b-w')
				.raw()
				.toBuffer();

			const imageData: ImageData = {
				width: INKPLATE_WIDTH,
				height: INKPLATE_HEIGHT,
				data: new Uint8ClampedArray(pixelBuffer.buffer),
			};

			const depth = req.body.mode === '1bit' ? 1 : 3;
			const levels = 2 ** depth;
			const dithered = floydSteinberg(imageData, createLinearQuantiser(levels));

			changeDepth(dithered, depth);

			if (depth === 1) {
				await sendMessageToPanel(req.params.panelId, new DrawBitmap1BitMessage(dithered));
			} else {
				await sendMessageToPanel(req.params.panelId, new DrawBitmap3BitMessage(dithered));
			}
		}
	);

	app.get(
		'/',
		{
			schema: {
				response: {
					200: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
			} as const,
		},
		async (req, res) => {
			return ['reboot', 'ota', 'config', 'display'];
		}
	);
};
