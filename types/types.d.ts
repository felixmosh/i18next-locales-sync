import { PluralResolver } from '../src/i18next/PluralResolver';

export type JSONValue = JSONObject | Array<JSONValue> | string | number | null;

export type JSONObject = { [key: string]: JSONValue };

export type LocaleObject = { language: string; data: JSONObject };

export interface Inputs {
  source: LocaleObject;
  target: LocaleObject;
  depth?: number;
  pluralResolver?: PluralResolver;
}

export type LocaleFile = {
  filePath: string;
  data: JSONObject;
  hash: string;
};

export type LocalesFiles = Record<string, Record<string, LocaleFile>>;
