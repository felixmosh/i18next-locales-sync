import { JSONObject, JSONValue } from '../../types/types';
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
  {
    useEmptyString = false,
    isTargetRequiresPluralForm,
  }: Partial<{ useEmptyString: boolean; isTargetRequiresPluralForm: boolean }> = {}
) {
  const singularSourceKey = pluralResolver.getSingularFormOfKey(sourceLng, sourceKey);

  if (isTargetRequiresPluralForm) {
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
  } else {
    const existingTargetValue = targetObject && targetObject[singularSourceKey];

    if (existingTargetValue && !isObject(existingTargetValue)) {
      newTargetObject[singularSourceKey] = existingTargetValue;
    } else {
      // the target language has no plural forms, so the source plural keys are represented
      // by a single base key, that must be created even when the source has no base key.
      const sourceCandidateKeys = [singularSourceKey].concat(
        pluralResolver.getPluralFormsOfKey(sourceLng, singularSourceKey)
      );

      const sourceValue = useEmptyString
        ? undefined
        : (sourceCandidateKeys
            .map((key) => sourceObject[key])
            .find((value) => value && !isObject(value)) as JSONValue | undefined);

      newTargetObject[singularSourceKey] = sourceValue ?? '';
    }
  }
}
