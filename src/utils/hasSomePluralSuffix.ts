export function hasSomePluralSuffix(key: string, suffixes: string[]): boolean {
  return suffixes.some((suffix) => key.endsWith(suffix));
}
