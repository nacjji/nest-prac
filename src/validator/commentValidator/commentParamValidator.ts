import * as Joi from 'joi';

export const commentParamValidator = Joi.object({
  articleId: Joi.number()
    .required()
    .integer()
    .error(new Error('Article ID를 확인해주세요')),
  parentId: Joi.number()
    .optional()
    .integer()
    .error(new Error('Parent ID를 확인해주세요')),
});
