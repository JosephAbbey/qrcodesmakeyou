import { toString } from 'qrcode';
import type { Theme } from '@prisma/client';

export default async function qrcode(
  url: string,
  theme?: Omit<Theme, 'id' | 'userId'>,
  margin = 4
): Promise<string> {
  let code: string = await toString(url, {
    type: 'svg',
    color: { light: theme?.light, dark: theme?.dark },
    margin
  });
  const size = parseInt(code.match(/viewBox="0 0 (\d+) \d+"/)?.[1] ?? '33');

  if (theme?.corners_path)
    code = code.replace(
      '</svg>',
      `<path d="M0 0h-7v-7H0z" fill="${theme.light ?? '#ffffff'}" transform="translate(${
        7 + margin
      } ${7 + margin})" />` +
        `<path d="M0 0h-7v-7H0z" fill="${theme.light ?? '#ffffff'}" transform="translate(${
          size - margin
        } ${7 + margin})" />` +
        `<path d="M0 0h-7v-7H0z" fill="${theme.light ?? '#ffffff'}" transform="translate(${
          7 + margin
        } ${size - margin})" />` +
        `<path d="${theme.corners_path}" fill="${
          theme.corners_fill ?? '#000000'
        }" transform="translate(${7 + margin} ${7 + margin})" />` +
        `<path d="${theme.corners_path}" fill="${
          theme.corners_fill ?? '#000000'
        }" transform="rotate(90) translate(${7 + margin} -${size - margin - 7})" />` +
        `<path d="${theme.corners_path}" fill="${
          theme.corners_fill ?? '#000000'
        }" transform="rotate(-90) translate(-${size - margin - 7} ${7 + margin})" />` +
        '</svg>'
    );

  return code;
}
