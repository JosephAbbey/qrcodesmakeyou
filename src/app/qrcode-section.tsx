'use client'

import { ThemeType } from '@/app/themes/themes'
import { QRCode } from '@/components/qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import qrcode, { copy, download, share } from '@/lib/qrcode'
import { Check, Copy, Download, Share2, Wifi } from 'lucide-react'
import {
  createContext,
  useState,
  type ReactNode,
  useEffect,
  Suspense,
} from 'react'
import { toast } from 'sonner'

export const SetUrlContext = createContext<((value: string) => void) | null>(
  null,
)

export const ThemeContext = createContext<{
  theme: ThemeType | null
  setTheme: (value: ThemeType | null) => void
} | null>(null)

export default function QRCodeSection({
  quicks,
  themes,
  defaultUrl,
}: {
  quicks: ReactNode
  themes: ReactNode
  defaultUrl?: string | undefined
}) {
  const [url, setUrl] = useState(defaultUrl ?? 'https://qr.josephabbey.dev')

  const [theme, setTheme] = useState<ThemeType | null>(null)

  const [svg, setSvg] = useState<Promise<string> | null>(null)
  useEffect(() => {
    if (!url) return
    setSvg(qrcode(url, theme))
  }, [url, theme])

  return (
    <main className='m-4 flex flex-col items-center gap-16'>
      <div className='flex w-full max-w-4xl gap-2'>
        <Input
          className='flex-grow'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant='outline' size='icon' className='flex-shrink-0'>
              <Wifi className='h-4 w-4' />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <form
              className='mx-auto w-full max-w-sm'
              action={(data) => {
                const ssid = data.get('ssid') as string
                const password = data.get('password') as string
                const security = data.get('security') as
                  | 'WEP'
                  | 'WPA'
                  | 'nopass'
                const hidden = data.get('hidden') === 'on'

                setUrl(
                  `WIFI:S:${ssid};T:${security};P:${password};H:${hidden};`,
                )
              }}
            >
              <DrawerHeader>
                <DrawerTitle>WiFi Network</DrawerTitle>
                <DrawerDescription>
                  Generate a QR code to automatically connect to a WiFi network.
                </DrawerDescription>
              </DrawerHeader>
              <div className='mx-4 flex flex-col gap-2'>
                <Input placeholder='SSID' id='ssid' name='ssid' />
                <Input placeholder='Password' id='password' name='password' />
                <Select defaultValue='WPA' name='security'>
                  <SelectTrigger>
                    <SelectValue placeholder='Security' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='WEP'>WEP</SelectItem>
                    <SelectItem value='WPA'>WPA</SelectItem>
                    <SelectItem value='nopass'>No Password</SelectItem>
                  </SelectContent>
                </Select>
                <div className='mt-2 flex items-center space-x-2'>
                  <Checkbox id='hidden' name='hidden' />
                  <Label htmlFor='hidden'>Hidden Network</Label>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button type='submit'>Submit</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button type='button' variant='destructive'>
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      </div>
      <div className='aspect-square w-full max-w-80 overflow-hidden rounded-xl'>
        {svg ?
          <Suspense fallback={<Skeleton className='h-full w-full' />}>
            <QRCode svg={svg} />
          </Suspense>
        : <Skeleton className='h-full w-full' />}
      </div>
      <div className='flex flex-wrap justify-center gap-2'>
        <Button
          type='button'
          onClick={async () => {
            const s = await svg
            if (s) await download(s, 'image/svg+xml')
          }}
          className='flex gap-2'
        >
          <Download />
          Save (.svg)
        </Button>
        <Button
          type='button'
          onClick={async () => {
            const s = await svg
            if (s) await download(s, 'image/png')
          }}
          className='flex gap-2'
        >
          <Download />
          Save (.png)
        </Button>
        <Button
          type='button'
          onClick={async () => {
            const s = await svg
            if (s) await share(s, 'image/png')
          }}
          className='flex gap-2'
        >
          <Share2 />
          Share (.png)
        </Button>
        <Button
          type='button'
          onClick={async () => {
            const s = await svg
            if (s) {
              await copy(s, 'image/png')
              toast('Copied to clipboard')
            }
          }}
          className='flex gap-2'
        >
          <Copy />
          Copy (.png)
        </Button>
      </div>
      <Tabs defaultValue='quick' className='w-full max-w-2xl'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='quick'>Quick</TabsTrigger>
          <TabsTrigger value='theme'>Theme</TabsTrigger>
        </TabsList>
        <TabsContent value='quick'>
          <ScrollArea className='h-[calc(100svh-9rem)]'>
            <SetUrlContext.Provider value={setUrl}>
              <Suspense
                fallback={
                  <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
                    {new Array(6).fill(null).map((_, i) => (
                      <Card key={i}>
                        <CardHeader className='flex h-full flex-row items-center gap-4 space-y-0'>
                          <div className='aspect-square w-20 min-w-20 overflow-hidden rounded-md bg-secondary'>
                            <Skeleton />
                          </div>
                          <div className='flex-grow space-y-2'>
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-1/2' />
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                }
              >
                {quicks}
              </Suspense>
            </SetUrlContext.Provider>
          </ScrollArea>
        </TabsContent>
        <TabsContent value='theme'>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <ScrollArea className='h-[calc(100svh-9rem)]'>
              <Suspense
                fallback={
                  <div className='grid grid-cols-2 gap-2 p-2 lg:grid-cols-4'>
                    {new Array(18).fill(null).map((_, i) => (
                      <Skeleton key={i} className='aspect-square' />
                    ))}
                  </div>
                }
              >
                {themes}
              </Suspense>
            </ScrollArea>
          </ThemeContext.Provider>
        </TabsContent>
      </Tabs>
    </main>
  )
}