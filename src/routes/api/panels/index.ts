import { TypedFastifyInstance, TypedFastifyPluginAsync } from '@/routes/api';
import { PanelSchema } from '@/schemas';
import { panelId } from 'routes/api/panels/[panelId]';
import { getPanels } from '@/services/panels';

export const panels: TypedFastifyPluginAsync = async function (app) {
	app.get(
		'/',
		{
			schema: {
				response: {
					200: {
						type: 'array',
						items: PanelSchema,
					},
				},
			} as const,
		},
		async (req, res) => {
			return getPanels();
		}
	);

	app.register(panelId, { prefix: '/:panelId' });
};
