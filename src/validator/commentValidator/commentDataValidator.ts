import * as Joi from 'joi';

export const commentDataValidator = Joi.object({
  id: Joi.number()
    .alter({ update: (schema) => schema.required() })
    .error(new Error('ID를 확인해주세요')),
  content: Joi.string().required().error(new Error('ID를 확인해주세요')),
  articleId: Joi.number()
    .alter({ create: (schema) => schema.required() })
    .integer()
    .error(new Error('Article ID를 확인해주세요')),
  parentId: Joi.number()
    .optional()
    .integer()
    .error(new Error('Parent ID를 확인해주세요')),
});
