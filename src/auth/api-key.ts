import { createHash } from 'node:crypto';

import { preHandlerAsyncHookHandler } from "fastify";
import { ADMIN_API_KEY_HASH } from "@/env";

export const verifyApiKey: preHandlerAsyncHookHandler = async (request, reply) => {
   if (typeof request.query !== 'object' || request.query === null) {
     return reply.unauthorized('Missing API key');
   }

  if (!('apiKey' in request.query)) {
    return reply.unauthorized('Missing API key');
  }

  const apiKey = request.query.apiKey;

  if (typeof apiKey !== 'string') {
    return reply.unauthorized('Invalid API key');
  }

  const apiKeyHash = createHash('sha256').update(apiKey).digest('hex');

  if (apiKeyHash !== ADMIN_API_KEY_HASH) {
    return reply.unauthorized('Unauthorized API key');
  }
}
