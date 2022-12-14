import { createServer } from 'http';
import { createWebSocketServer } from '@/routes/ws';
import { createAPIServer } from '@/routes/api';
import * as panelService from '@/services/panels';

const apiServer = createAPIServer({ path: '/api' });
const wsServer = createWebSocketServer({ server: apiServer.server.server, path: '/ws' });

panelService.setWebSocketServer(wsServer);

export { apiServer, wsServer };
