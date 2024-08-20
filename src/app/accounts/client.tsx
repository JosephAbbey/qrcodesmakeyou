'use client'

import { deleteAccount } from './actions'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { cn } from '@/lib/utils'
import { SiGithub, SiSpotify, SiYoutube } from '@icons-pack/react-simple-icons'
import { Trash2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export function AccountRow({
  account,
}: {
  account: Exclude<
    Awaited<ReturnType<typeof prisma.account.findUnique>>,
    null | undefined
  >
}) {
  const [deleted, setDeleted] = useState(false)

  return (
    <div
      key={account.id}
      className={cn(
        'relative overflow-hidden *:hover:translate-x-0 *:hover:scale-x-100',
        {
          hidden: deleted,
        },
      )}
    >
      <Button
        type='submit'
        variant={account.error ? 'destructive' : 'outline'}
        className='flex w-full flex-grow gap-2 overflow-hidden'
        onClick={() => signIn(account.provider)}
      >
        {account.provider == 'google' ?
          <SiYoutube className='mr-2 h-4 w-4 min-w-4' />
        : account.provider == 'github' ?
          <SiGithub className='mr-2 h-4 w-4 min-w-4' />
        : account.provider == 'spotify' ?
          <SiSpotify className='mr-2 h-4 w-4 min-w-4' />
        : <></>}
        {account.username}
        {account.email && (
          <span className='min-w-0 overflow-hidden overflow-ellipsis text-muted-foreground'>
            {account.email}
          </span>
        )}
      </Button>
      <Button
        type='submit'
        variant='destructive'
        size='icon'
        className='absolute right-0 top-0 translate-x-1/2 scale-x-0 overflow-hidden transition-transform'
        onClick={async () => {
          setDeleted(true)
          await deleteAccount(account.id)
        }}
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  )
}
