import path from 'path';
import { syncLocales } from '../src';

describe('syncLocales', () => {
  it('should sync locale files without namespaces', () => {
    const primaryLanguage = 'en';
    const otherLanguages = ['jp'];
    syncLocales({
      primaryLanguage,
      otherLanguages,
      localesFolder: path.resolve('./test/fixtures/fixture1'),
      outputFolder: path.resolve('./test/output/fixture1'),
      fileExtension: '.json',
    });
  });
});
