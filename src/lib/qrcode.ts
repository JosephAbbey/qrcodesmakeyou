import type { Theme } from '@prisma/client'
import memoize from 'memoize'
import { QRCodeToStringOptions, toString } from 'qrcode'

const toStringMemoized = memoize(toString, {
  cacheKey(arguments_) {
    return `${arguments_[0]},${arguments_[1].color?.light},${arguments_[1].color?.dark},${arguments_[1].margin}`
  },
})

export default async function qrcode(
  url: string,
  theme?: Omit<Theme, 'id' | 'userId'> | null,
  margin = 4,
): Promise<string> {
  let code: string = await toStringMemoized(url, {
    type: 'svg',
    color: {
      light: theme?.light ?? '#ffffff',
      dark: theme?.dark ?? '#000000',
    },
    margin,
  } satisfies QRCodeToStringOptions as QRCodeToStringOptions)
  const size = parseInt(code.match(/viewBox="0 0 (\d+) \d+"/)?.[1] ?? '33')

  if (theme?.rounded) {
    code = code.replace(
      /<path[^/]*?\/>/,
      (m) =>
        m +
        `<g style="filter: blur(0.2px) contrast(100000000)"><path d="M0 0h${size - margin * 2 + 1}v${size - margin * 2 + 1}H0z" fill="${theme.light ?? '#ffffff'}" transform="translate(${
          margin - 0.5
        } ${margin - 0.5})" />`,
    )
    code = code.replace('</svg', '</g></svg')
  }

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
        '</svg>',
    )

  return code
}

type CopyMimeType = 'image/svg+xml' | 'image/png'
type MimeType = 'image/svg+xml' | 'image/png' | 'image/jpg'

export function blob(
  svg: string,
  mimetype: MimeType = 'image/svg+xml',
): Promise<{
  filename: string
  mimetype: MimeType
  blob: Blob
}> {
  return new Promise((resolve, reject) => {
    if (mimetype == 'image/svg+xml') {
      resolve({
        filename: 'qrcode.svg',
        mimetype,
        blob: new Blob([svg]),
      })
    } else {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 600
      const ctx = canvas.getContext('2d')!

      const img = new Image()

      img.addEventListener('load', () => {
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (b) =>
            resolve({
              filename: 'qrcode.' + mimetype.substring(6),
              mimetype,
              blob: b!,
            }),
          mimetype,
        )
      })

      img.src = 'data:image/svg+xml;base64,' + btoa(svg)
    }
  })
}

export function data(
  svg: string,
  mimetype: MimeType = 'image/svg+xml',
): Promise<{
  filename: string
  mimetype: MimeType
  url: string
}> {
  return new Promise((resolve, reject) => {
    if (mimetype == 'image/svg+xml') {
      resolve({
        filename: 'qrcode.svg',
        mimetype,
        url: 'data:image/svg+xml;base64,' + btoa(svg),
      })
    } else {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 600
      const ctx = canvas.getContext('2d')!

      const img = new Image()

      img.addEventListener('load', () => {
        ctx.drawImage(img, 0, 0)

        resolve({
          filename: `qrcode.${mimetype.substring(6)}`,
          mimetype,
          url: canvas.toDataURL(mimetype),
        })
      })

      img.src = 'data:image/svg+xml;base64,' + btoa(svg)
    }
  })
}

export async function share(svg: string, mimetype?: MimeType) {
  const b = await blob(svg, mimetype)
  await navigator.share({
    title: b.filename,
    files: [new File([b.blob], b.filename, { type: b.mimetype })],
  })
}

export async function copy(svg: string, mimetype: CopyMimeType = 'image/png') {
  if (mimetype == 'image/png')
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': (await blob(svg, mimetype)).blob }),
    ])
  else await navigator.clipboard.writeText(svg)
}

export async function download(svg: string, mimetype?: MimeType) {
  const d = await data(svg, mimetype)
  const link = document.createElement('a')
  link.download = d.filename
  link.href = d.url
  link.click()
}
