/* eslint-disable @typescript-eslint/no-empty-interface */
import { CommonParamModel } from './commonParam.interface';

export interface ArticleModel {
  id?: number;
  title: string;
  content: string;
}
export interface ArticleParamModel extends CommonParamModel {}
