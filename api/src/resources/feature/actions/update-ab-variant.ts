import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter, Next } from 'types';
import { featureService, Feature } from 'resources/feature';

import featureAuth from '../middlewares/feature-auth.middleware';
import { Env } from '../../application';
import { remoteConfigSchema } from '../feature.schema';
import saveChangesMiddleware from '../middlewares/save-changes.middleware';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  name: Joi.string()
    .trim()
    .max(64)
    .required()
    .messages({
      'any.required': 'Variant name is required',
      'string.empty': 'Variant name is required',
    }),
  remoteConfig: remoteConfigSchema,
});

type ValidatedData = {
  remoteConfig: string;
  env: Env,
  name: string,
};

async function handler(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { featureId, variantIndex } = ctx.params;
  const { remoteConfig, env, name } = ctx.validatedData;

  const updatedFeature = await featureService.updateOne(
    { _id: featureId },
    (doc) => {
      const test = doc.envSettings[env].tests[variantIndex];
      const newTests = [...doc.envSettings[env].tests];
      newTests[variantIndex] = { ...test, name, remoteConfig };
      doc.envSettings[env].tests = newTests;
      return doc;
    },
  ) as Feature;

  ctx.state.featureChanges = {
    featureId,
    env,
    data: {
      tests: updatedFeature.envSettings[env].tests,
    },
  };

  ctx.body = updatedFeature;
  return next();
}

export default (router: AppRouter) => {
  router.put(
    '/:featureId/tests/:variantIndex',
    featureAuth,
    validateMiddleware(schema),
    handler,
    saveChangesMiddleware,
  );
};
