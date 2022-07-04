import { JSONObject, JSONValue, LocaleObject } from '../types/types';
import { MAX_DEPTH } from './constats';
import { PluralResolver } from './i18next/PluralResolver';
import { generatePluralForms } from './utils/generatePluralForms';
import { hasSomePluralSuffix } from './utils/hasSomePluralSuffix';
import { isObject } from './utils/isObject';
import { traverse } from './utils/traverse';

interface IEntryOptions {
  sourceLng: string;
  targetLng: string;
  pluralResolver: PluralResolver;
  useEmptyString?: boolean;
}

function syncEntry({ sourceLng, targetLng, pluralResolver, useEmptyString }: IEntryOptions) {
  const sourceSuffixes = pluralResolver.getPluralFormsOfKey(sourceLng, '').filter(Boolean);
  const targetSuffixes = pluralResolver.getPluralFormsOfKey(targetLng, '').filter(Boolean);

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
            sourceKey,
            sourceLng,
            targetLng,
          },
          pluralResolver,
          useEmptyString
        );
    } else {
      newTargetObject[sourceKey] =
        targetValue && !isObject(targetValue) ? targetValue : useEmptyString ? '' : sourceValue;

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
  useEmptyString?: boolean;
}

export function syncJson({
  source,
  target,
  pluralResolver,
  depth = MAX_DEPTH,
  useEmptyString = false,
}: SyncJsonOptions) {
  target.data = traverse(
    source.data,
    target.data,
    syncEntry({
      sourceLng: source.language,
      targetLng: target.language,
      pluralResolver,
      useEmptyString,
    }),
    depth
  );

  return target;
}
