import * as Joi from 'joi';

export const anonyBoardDataValidator = Joi.object({
  id: Joi.number().alter({
    update: (schema) =>
      schema.required().error(new Error('ID를 확인해주세요.')),
  }),

  title: Joi.string().required().error(new Error('제목을 확인해주세요.')),
  content: Joi.string().required().error(new Error('내용을 확인해주세요.')),
  password: Joi.string()
    .required()
    .error(new Error('비밀번호를 확인해주세요.')),
});
