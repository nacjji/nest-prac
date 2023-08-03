import * as Joi from 'joi';

export const commonParamValidator = Joi.object({
  id: Joi.number().optional().integer().error(new Error('ID를 확인해주세요.')),
  page: Joi.number()
    .optional()
    .integer()
    .error(new Error('Page를 확인해주세요.')),
  per: Joi.number()
    .optional()
    .integer()
    .error(new Error('Per를 확인해주세요.')),
});
