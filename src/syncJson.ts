import { JSONObject, JSONValue } from '../types/types';
import { MAX_DEPTH } from './constats';
import { isObject } from './utils/isObject';
import { traverse } from './utils/traverse';

function addMissingKeys(
  _sourceObject: JSONObject,
  targetObject: JSONObject,
  key: string,
  sourceValue: JSONValue,
  targetValue: JSONValue
) {
  if (Array.isArray(sourceValue)) {
    targetObject[key] =
      targetObject[key] && Array.isArray(targetObject[key]) ? targetObject[key] : [];
  } else if (isObject(sourceValue)) {
    targetObject[key] = targetObject[key] && isObject(targetObject[key]) ? targetObject[key] : {};
  } else {
    targetObject[key] = targetValue && !isObject(targetValue) ? targetValue : sourceValue;
  }
}

function removeKeys(targetObject: JSONObject, sourceObject: JSONObject, key: string) {
  if (sourceObject[key]) {
    // source has the target's key
    return;
  }

  if (Array.isArray(targetObject)) {
    targetObject.splice(+key, 1);
  } else if (isObject(targetObject)) {
    delete targetObject[key];
  }
}

export function syncJson(source: JSONObject, target: JSONObject, depth = MAX_DEPTH) {
  traverse(source, target, addMissingKeys, depth);
  traverse(target, source, removeKeys, depth);

  return target;
}
