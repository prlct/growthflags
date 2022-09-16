import Joi from 'joi';
import { Env } from 'resources/application';

const envSettingsSchema = Joi.object({
  enabled: Joi.boolean().required().default(false),
  enabledForEveryone: Joi.boolean().required().default(false),
  users: Joi.array().items(Joi.string()).unique().required().default([]),
  usersPercentage: Joi.number().min(0).max(100).required().default(0),
  usersViewedCount: Joi.number().required().default(0),
  tests: Joi.array().items(Joi.string()).unique().required().default([]),
  visibilityChangedOn: Joi.date(), 
});

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required().allow(''),
  envSettings: Joi.object({
    [Env.DEVELOPMENT]: envSettingsSchema,
    [Env.STAGING]: envSettingsSchema,
    [Env.DEMO]: envSettingsSchema,
    [Env.PRODUCTION]: envSettingsSchema,
  }),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
