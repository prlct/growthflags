import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  sequenceId: Joi.string().required(),
  delayDays: Joi.number().integer(),
  name: Joi.string().required(),
  enabled: Joi.bool().required(),
  subject: Joi.string(),
  body: Joi.string(),
  sent: Joi.number().default(0),
  index: Joi.number().integer().min(0),
  converted: Joi.number().default(0),
  unsubscribed: Joi.number().default(0),
  clicked: Joi.number().default(0),
  allowRedirect: Joi.boolean().default(false),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
