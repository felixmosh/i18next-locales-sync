import { JSONObject } from '../../types/types';
import { PluralResolver } from '../i18next/PluralResolver';
import { isObject } from './isObject';

interface Options {
  sourceObject: JSONObject;
  targetObject: JSONObject;
  newTargetObject: JSONObject;
  sourceKey: string;
  sourceLng: string;
  targetLng: string;
}

export function generatePluralForms(
  { sourceKey, sourceLng, targetLng, newTargetObject, targetObject, sourceObject }: Options,
  pluralResolver: PluralResolver,
  useEmptyString = false
) {
  const singularSourceKey = pluralResolver.getSingularFormOfKey(sourceLng, sourceKey);
  const pluralForms = pluralResolver.getPluralFormsOfKey(targetLng, singularSourceKey);

  const fallbackValue = useEmptyString ? '' : sourceObject[sourceKey];

  pluralForms.forEach((key) => {
    newTargetObject[key] =
      (targetObject && targetObject[key] && !isObject(targetObject[key])
        ? targetObject[key]
        : useEmptyString
        ? ''
        : sourceObject[key]) || fallbackValue;
  });
}
