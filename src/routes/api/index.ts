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
import { fastifyAuth } from "@fastify/auth";
import { fastifySensible } from '@fastify/sensible';

import { panels } from '@/routes/api/panels';
import { RawOptions } from 'sharp';
import { verifyApiKey } from "@/auth/api-key";

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
  // Create a Fastify server
	const app = fastify({})
    .withTypeProvider<JsonSchemaToTsProvider>()
    .register(fastifySensible)
    .register(fastifyAuth);

  // Register auth strategies
  app.addHook('preHandler', app.auth([verifyApiKey]));

  // Register routes
	app.register(panels, { prefix: `${path}/panels` });

	return {
		server: app,
	};
}
