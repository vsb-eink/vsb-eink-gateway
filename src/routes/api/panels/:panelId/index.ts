import { TypedFastifyPluginAsync } from '@/routes/api';
import { PanelSchema } from '@/schemas';
import { getPanel } from '@/services/panels';
import { ParamsSchema } from '@/routes/api/panels/:panelId/types';
import { commands } from '@/routes/api/panels/:panelId/commands';

export const panelId: TypedFastifyPluginAsync = async function (app) {
	app.get(
		'/:panelId',
		{
			schema: {
				params: ParamsSchema,
				response: {
					200: PanelSchema,
				},
			},
		} as const,
		async (req, res) => {
			return getPanel(req.params.panelId);
		}
	);

	app.register(commands, { prefix: '/commands' });
};
