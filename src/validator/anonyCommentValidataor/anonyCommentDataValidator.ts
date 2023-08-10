import * as Joi from 'joi';

export const anonyCommentDataValidator = Joi.object({
  id: Joi.number()
    .alter({ update: (schema) => schema.required() })
    .error(new Error('ID를 확인해주세요')),
  content: Joi.string().required().error(new Error('내용을 확인해주세요')),
  anonyBoardId: Joi.number()
    .alter({ create: (schema) => schema.required() })
    .integer()
    .error(new Error('AnonyBoard ID를 확인해주세요')),
  parentId: Joi.number()
    .optional()
    .integer()
    .error(new Error('Parent ID를 확인해주세요')),
  password: Joi.string()
    .required()
    .error(new Error('비밀번호를 확인해주세요.')),
});
