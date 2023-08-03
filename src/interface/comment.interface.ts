import { CommonParamModel } from './commonParam.interface';

export interface CommentModel {
  id?: number;
  content: string;
  articleId: number;
  parentId?: number;
}

export interface CommentParamModel extends CommonParamModel {
  articleId: number;
  parentId: number;
}
