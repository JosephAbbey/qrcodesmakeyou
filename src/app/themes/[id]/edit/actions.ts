'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { type } from 'arktype'
import { redirect } from 'next/navigation'

const SaveData = type({
  light: /^#[0-9a-fA-F]{6}$/,
  dark: /^#[0-9a-fA-F]{6}$/,
  corners_path: 'string',
  corners_fill: /^#[0-9a-fA-F]{6}$/,
  rounded: 'boolean',
})

export async function save(id: string, raw_data: (typeof SaveData)['infer']) {
  // console.log(raw_data)
  const session = await auth()
  if (session == null || !session.user) {
    throw new Error('Unauthorized')
  }

  const data = SaveData(raw_data)
  if (data instanceof type.errors) {
    throw new Error('Invalid data')
  }

  const cornersPath = minifyPath(data.corners_path).replaceAll('"', '')

  await prisma.theme.update({
    where: { id },
    data: {
      light: data.light == '#ffffff' ? null : data.light,
      dark: data.dark == '#000000' ? null : data.dark,
      corners_path: cornersPath == '' ? null : cornersPath,
      corners_fill: data.corners_fill == '#000000' ? null : data.corners_fill,
      rounded: data.rounded,
    },
  })

  redirect(`/themes/${id}`)
}

function minifyPath(path: string): string {
  return path
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^([a-zA-Z])\s+/i, '$1')
    .replace(/\s+-/g, '-')
    .replace(/(\.[0-9]+)\s+(?=\.)/g, '$1')
    .replace(/\b0+([1-9]\d*\.)/g, '$1')
    .replace(/\b0+\./g, '.')
    .replace(/(\.\d*[1-9])0+\b/g, '$1')
    .replace(/\.0+/g, '')
    .replace(/\s([a-zA-Z])\s/g, '$1')
}
