import * as env from 'env-var';

export const PORT = env.get('PORT').default('8888').asPortNumber();
export const HOST = env.get('HOST').default('0.0.0.0').asString();
