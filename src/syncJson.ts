import { Inputs, JSONObject, JSONValue } from '../types/types';
import { MAX_DEPTH } from './constats';
import { LanguageUtil } from './i18next/LanguageUtils';
import { PluralResolver } from './i18next/PluralResolver';
import { hasSomePluralSuffix } from './utils/hasSomePluralSuffix';
import { isObject } from './utils/isObject';
import { traverse } from './utils/traverse';

const pluralResolver = new PluralResolver(new LanguageUtil());

function generatePluralForms({
  sourceKey,
  sourceLng,
  targetLng,
  newTargetObject,
  targetObject,
  sourceObject,
}: {
  sourceObject: JSONObject;
  targetObject: JSONObject;
  newTargetObject: JSONObject;
  sourceKey: string;
  sourceValue: JSONValue;
  targetValue: JSONValue;
  sourceLng: string;
  targetLng: string;
}) {
  const singularSourceKey = pluralResolver.getSingularFormOfKey(sourceKey, sourceLng);

  const pluralForms = pluralResolver.getPluralFormsOfKey(singularSourceKey, targetLng);

  pluralForms.forEach((key) => {
    newTargetObject[key] =
      targetObject[key] && !isObject(targetObject[key])
        ? targetObject[key]
        : sourceObject[key] || sourceObject[sourceKey];
  });
}

function syncEntry(sourceLng: string, targetLng: string) {
  const sourceSuffixes = pluralResolver.getPluralFormsOfKey('', sourceLng).filter(Boolean);

  const isTargetRequiresPluralForm = pluralResolver.needsPlural(targetLng);

  return (
    sourceObject: JSONObject,
    targetObject: JSONObject,
    newTargetObject: JSONObject,
    sourceKey: string,
    sourceValue: JSONValue,
    targetValue: JSONValue
  ) => {
    if (Array.isArray(sourceValue)) {
      newTargetObject[sourceKey] = [];
    } else if (isObject(sourceValue)) {
      newTargetObject[sourceKey] = {};
    } else if (hasSomePluralSuffix(sourceKey, sourceSuffixes)) {
      isTargetRequiresPluralForm &&
        generatePluralForms({
          sourceObject,
          targetObject,
          newTargetObject,
          sourceValue,
          targetValue,
          sourceKey,
          sourceLng,
          targetLng,
        });
    } else {
      newTargetObject[sourceKey] =
        targetValue && !isObject(targetValue) ? targetValue : sourceValue;
    }
  };
}

export function syncJson({ source, target, depth = MAX_DEPTH }: Inputs) {
  target.data = traverse(
    source.data,
    target.data,
    syncEntry(source.language, target.language),
    depth
  );

  return target;
}
