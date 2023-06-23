export default function (path: string): string {
  return path
    .replace(/^([a-zA-Z])\s+/i, '$1')
    .replace(/\s+-/g, '-')
    .replace(/(\.[0-9]+)\s+(?=\.)/g, '$1');
}
