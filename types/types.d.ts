export type JSONValue = JSONObject | Array<JSONValue> | string | number | null;

export type JSONObject = { [key: string]: JSONValue };

export type LocaleObject = { language: string; data: JSONObject };

export type LocaleFile = {
  filePath: string;
  data: JSONObject;
  hash: string;
};

export type LocalesFiles = Record<string, Record<string, LocaleFile>>;
