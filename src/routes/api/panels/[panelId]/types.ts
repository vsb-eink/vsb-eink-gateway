export const ParamsSchema = {
	type: 'object',
	properties: {
		panelId: { type: 'string' },
	},
	required: ['panelId'],
} as const;
