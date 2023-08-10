import * as Joi from 'joi';

export const commentParamValidator = Joi.object({
  mainBoardId: Joi.number()
    .required()
    .integer()
    .error(new Error('MainBoard ID를 확인해주세요')),
  parentId: Joi.number()
    .optional()
    .integer()
    .error(new Error('Parent ID를 확인해주세요')),
});
