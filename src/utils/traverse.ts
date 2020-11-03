import { JSONObject, JSONValue } from '../../types/types';
import { LIB_PREFIX, MAX_DEPTH } from '../constats';
import { isObject } from './isObject';

export function traverse(
  source: JSONObject,
  target: JSONObject,
  fn: (
    sourceObj: JSONObject,
    targetObj: JSONObject,
    newTargetObj: JSONObject,
    prop: string,
    sourceValue: JSONValue,
    targetValue: JSONValue
  ) => any,
  depth = MAX_DEPTH,
  finalObj: any = {}
): JSONObject {
  if (depth === 0) {
    throw new Error(`${LIB_PREFIX} given json with depth that is deeper than ${MAX_DEPTH}`);
  }

  for (const key in source) {
    if (!source.hasOwnProperty(key)) {
      continue;
    }

    const sourceValue = source[key];
    fn.apply(null, [source, target, finalObj, key, source[key], target && target[key]]);
    if (isObject(sourceValue)) {
      traverse(sourceValue, target && (target[key] as any), fn, depth - 1, finalObj[key]);
    }
  }

  return finalObj;
}
