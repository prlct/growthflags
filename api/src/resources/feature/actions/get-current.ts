import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { Env } from 'resources/application';
import { featureService, Feature } from 'resources/feature';
import { getFlatFeature } from '../utils/get-flat-feature';
import featureAuth from '../middlewares/feature-auth.middleware';


const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
});

type ValidatedData = {
  env: Env;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureId } = ctx.params;
  const { env } = ctx.validatedData;

  // TODO: Get rid from this request (featureAuth)
  const feature = await featureService.findOne({ _id: featureId }) as Feature;

  ctx.body = getFlatFeature(feature, env);
}

export default (router: AppRouter) => {
  router.get('/:featureId', featureAuth, validateMiddleware(schema), handler);
};
