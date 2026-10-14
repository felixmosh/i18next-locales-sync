import { fdir } from 'fdir';
import fs from 'fs';
import path from 'path';
import { vol } from 'memfs';

const basePath = path.resolve('./test/fixtures');
const fixtures = new fdir()
  .withFullPaths()
  .filter((filepath) => filepath.endsWith('.json'))
  .crawl(basePath)
  .sync();

const fileSystemJson = fixtures.reduce(
  (result, filepath) => {
    const relativePath = path.relative(basePath, filepath);
    result[`./${relativePath}`] = fs.readFileSync(filepath, { encoding: 'utf8' });
    return result;
  },
  {} as Record<string, string>
);

vol.fromJSON(fileSystemJson, basePath);

export default {
  existsSync(filepath: string) {
    return vol.existsSync(filepath);
  },
  ensureFileSync(filepath: string) {
    if (!vol.existsSync(filepath)) {
      vol.mkdirSync(path.dirname(filepath), { recursive: true });
      vol.writeFileSync(filepath, '');
    }
  },
  readJSONSync(filepath: string, options: { encoding: string }) {
    const data = vol.readFileSync(filepath, options);
    return JSON.parse(data as unknown as string);
  },
  writeJSONSync(filepath: string, data: unknown, options: { spaces: string | number }) {
    return vol.writeFileSync(filepath, JSON.stringify(data, null, options.spaces));
  },
};
