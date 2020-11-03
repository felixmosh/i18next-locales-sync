export type JSONValue = JSONObject | Array<JSONValue> | string | number | null;

export type JSONObject = { [key: string]: JSONValue };

export type LocaleObject = { language: string; data: JSONObject };

export interface Inputs {
  source: LocaleObject;
  target: LocaleObject;
  depth?: number;
}
