import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter, Next } from 'types';
import { featureService, Feature } from 'resources/feature';
import { Env } from 'resources/application';
import { getFlatFeature } from '../utils/get-flat-feature';
import featureAuth from '../middlewares/feature-auth.middleware';
import saveChangesMiddleware from '../middlewares/save-changes.middleware';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  percentage: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      'any.required': 'percentage is required',
      'number.empty': 'percentage is required',
    }),
});

type ValidatedData = {
  env: Env;
  percentage: number;
};

async function handler(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { featureId } = ctx.params;
  const { env, percentage } = ctx.validatedData;

  const feature = await featureService.updateOne(
    { _id: featureId },
    (doc) => {
      doc.envSettings[env].usersPercentage = percentage;
      doc.envSettings[env].visibilityChangedOn = new Date();
      return doc;
    },
  ) as Feature;

  ctx.state.featureChanges = {
    env,
    featureId,
    data: {
      usersPercentage: percentage,
    },
  };

  ctx.body = getFlatFeature(feature, env);
  return next();
}

export default (router: AppRouter) => {
  router.put('/:featureId/users-percentage', featureAuth, validateMiddleware(schema), handler, saveChangesMiddleware);
};
