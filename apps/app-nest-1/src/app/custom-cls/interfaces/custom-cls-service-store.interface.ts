import { CLS_ID, ClsStore } from 'nestjs-cls';

export interface ICustomClsServiceStore extends ClsStore {
  [CLS_ID]: string | undefined;
  entryMode: 'cron' | 'http' | undefined;
}
