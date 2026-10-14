import crypto from 'crypto';
import type { JSONObject } from '../../types/types.js';

export function hashJson(locale: JSONObject) {
  return crypto.createHash('md5').update(JSON.stringify(locale)).digest('hex');
}
