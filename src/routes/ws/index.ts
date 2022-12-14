import { IncomingMessage, Server as HTTPServer } from 'http';
import { Server as WebSocketServer, WebSocket } from 'ws';
import { waitFor } from '@/utils/wait';
import { clearInterval } from 'timers';
import { log } from 'util';

export interface WebSocketExtended extends WebSocket {
	clientId?: string;
}

export interface WebSocketServerArgs {
	server: HTTPServer;
	path: string;
}

export type WebSocketMiddleware = (ws: WebSocket, req?: IncomingMessage) => Promise<void> | void;

const authenticate: WebSocketMiddleware = async (ws: WebSocketExtended, req) => {
	if (!req) {
		console.error(`Received empty request object!`);
		ws.terminate();
		return;
	}

	const authorizationHeader = req.headers.authorization;

	if (!authorizationHeader) {
		console.error('No authorization header!');
		ws.close();
		return;
	}

	const [scheme, mac] = authorizationHeader.split(' ');

	if (scheme.toLowerCase() !== 'mac') {
		console.error(`Invalid authorization scheme: ${scheme}`);
		ws.close();
		return;
	}

	if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac)) {
		console.error(`Invalid MAC address: ${mac}`);
		ws.close();
		return;
	}

	ws.clientId = mac;
};

async function ping(ws: WebSocket) {
	let isAlive = true;

	const interval = setInterval(() => {
		if (!isAlive) {
			ws.terminate();
			return;
		}

		isAlive = false;
		ws.ping();
	}, 30000);

	ws.on('close', () => {
		clearInterval(interval);
	});

	ws.on('pong', () => {
		isAlive = true;
	});
}

async function logger(ws: WebSocketExtended, req?: IncomingMessage) {
	console.log(`Client connected: ${ws.clientId}`);
}

export type WebSocketServerInstance = ReturnType<typeof createWebSocketServer>;

export function createWebSocketServer({ server, path }: WebSocketServerArgs) {
	const wss = new WebSocketServer({ server, path });

	const sendTo = async (client: WebSocket, message: ArrayBuffer) => {
		await waitFor(() => client.readyState === WebSocket.OPEN);
		client.send(message, { binary: true });
	};

	const sendToAll = async (message: ArrayBuffer) => {
		const jobs = [];
		for (const client of wss.clients) {
			jobs.push(sendTo(client, message));
		}
		await Promise.all(jobs);
	};

	wss.on('connection', async (ws, req) => {
		await authenticate(ws, req);
		await logger(ws);
		await ping(ws);
	});

	return {
		server: wss,
		sendTo,
		sendToAll,
	};
}
