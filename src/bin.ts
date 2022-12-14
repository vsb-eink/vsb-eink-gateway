import { HOST, PORT } from './env';
import { apiServer } from './server';

apiServer.server.listen({ port: PORT, host: HOST }).then(() => {
	console.log(`Server listening on ${HOST}:${PORT}`);
});
