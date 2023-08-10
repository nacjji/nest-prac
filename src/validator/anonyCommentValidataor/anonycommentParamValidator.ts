import * as Joi from 'joi';

export const anonyCommentParamValidator = Joi.object({
  anonyBoardId: Joi.number()
    .required()
    .integer()
    .error(new Error('AnonyBoard ID를 확인해주세요')),
  parentId: Joi.number()
    .optional()
    .integer()
    .error(new Error('Parent ID를 확인해주세요')),
});
