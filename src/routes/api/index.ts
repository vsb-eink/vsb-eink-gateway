import { Server as HTTPServer } from 'http';
import {
	fastify,
	FastifyBaseLogger,
	FastifyInstance,
	FastifyPluginAsync,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
} from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';

import { panels } from '@/routes/api/panels';
import { RawOptions } from 'sharp';

export interface APIServerArgs {
	server?: HTTPServer;
	path: string;
}

export type TypedFastifyInstance = FastifyInstance<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	FastifyBaseLogger,
	JsonSchemaToTsProvider
>;

export type TypedFastifyPluginAsync = FastifyPluginAsync<
	RawOptions,
	RawServerDefault,
	JsonSchemaToTsProvider
>;

export function createAPIServer({ path }: APIServerArgs) {
	const app = fastify({}).withTypeProvider<JsonSchemaToTsProvider>();

	app.register(panels, { prefix: `${path}/panels` });

	return {
		server: app,
	};
}
