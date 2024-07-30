'use client'

import { use } from 'react'

export function QRCode({
  svg,
  className,
}: {
  svg: Promise<string>
  className?: string
}) {
  const data = use(svg)
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: data }}></div>
  )
}
