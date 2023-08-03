import * as Joi from 'joi';

export const configValidator = Joi.object({
  NODE_ENV: Joi.string().required().valid('dev', 'production', 'test'),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  SALT: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
