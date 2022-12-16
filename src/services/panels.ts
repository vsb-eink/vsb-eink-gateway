import { FromSchema } from 'json-schema-to-ts';
import { PanelSchema } from '@/schemas';
import { PanelMessage } from '@/panel/common';
import { WebSocketExtended, WebSocketServerInstance } from '@/routes/ws';

export type Panel = FromSchema<typeof PanelSchema>;

let wss: WebSocketServerInstance;

export async function getPanels() {
	const clients: Set<WebSocketExtended> = wss.server.clients;
	const panels: Panel[] = [];
	for (const client of clients) {
		panels.push({
			id: client.clientId!,
		});
	}
	return panels;
}

export async function getPanel(id: string) {
	const panels = await getPanels();
	return panels.find((panel) => panel.id === id);
}

export async function sendMessageToPanel(
	id: string,
	message: PanelMessage | PanelMessage<Uint16Array>
) {
	const clients: Set<WebSocketExtended> = wss.server.clients;
	for (const client of clients) {
		if (client.clientId !== id && id !== 'all') continue;
		await wss.sendTo(client, message.buffer);
	}
}

export function setWebSocketServer(server: WebSocketServerInstance) {
	wss = server;
}
