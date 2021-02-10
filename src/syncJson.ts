import { JSONObject, JSONValue, LocaleObject } from '../types/types';
import { MAX_DEPTH } from './constats';
import { PluralResolver } from './i18next/PluralResolver';
import { hasSomePluralSuffix } from './utils/hasSomePluralSuffix';
import { isObject } from './utils/isObject';
import { traverse } from './utils/traverse';

function generatePluralForms(
  {
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
  },
  pluralResolver: PluralResolver
) {
  const singularSourceKey = pluralResolver.getSingularFormOfKey(sourceKey, sourceLng);

  const pluralForms = pluralResolver.getPluralFormsOfKey(singularSourceKey, targetLng);

  pluralForms.forEach((key) => {
    newTargetObject[key] =
      (targetObject && targetObject[key] && !isObject(targetObject[key])
        ? targetObject[key]
        : sourceObject[key]) || sourceObject[sourceKey];
  });
}

function syncEntry(sourceLng: string, targetLng: string, pluralResolver: PluralResolver) {
  const sourceSuffixes = pluralResolver.getPluralFormsOfKey('', sourceLng).filter(Boolean);
  const targetSuffixes = pluralResolver.getPluralFormsOfKey('', targetLng).filter(Boolean);

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
        generatePluralForms(
          {
            sourceObject,
            targetObject,
            newTargetObject,
            sourceValue,
            targetValue,
            sourceKey,
            sourceLng,
            targetLng,
          },
          pluralResolver
        );
    } else {
      newTargetObject[sourceKey] =
        targetValue && !isObject(targetValue) ? targetValue : sourceValue;

      // keeps existing plural forms
      targetSuffixes.forEach((suffix) => {
        const pluralTargetKey = `${sourceKey}${suffix}`;

        if (targetObject && targetObject[pluralTargetKey]) {
          newTargetObject[pluralTargetKey] = targetObject[pluralTargetKey];
        }
      });
    }
  };
}

interface SyncJsonOptions {
  source: LocaleObject;
  target: LocaleObject;
  pluralResolver: PluralResolver;
  depth?: number;
}

export function syncJson({ source, target, pluralResolver, depth = MAX_DEPTH }: SyncJsonOptions) {
  target.data = traverse(
    source.data,
    target.data,
    syncEntry(source.language, target.language, pluralResolver),
    depth
  );

  return target;
}
