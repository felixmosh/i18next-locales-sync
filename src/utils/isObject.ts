import { JSONObject } from '../../types/types';

export function isObject(maybeObj: any): maybeObj is JSONObject {
  return maybeObj !== null && typeof maybeObj === 'object';
}
