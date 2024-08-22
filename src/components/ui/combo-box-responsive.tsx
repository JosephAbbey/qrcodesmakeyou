"use client"

import * as React from "react"

import { useIsDesktop } from "@/hooks/use-media-query"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ChevronsUpDown } from "lucide-react"

export type ComboItem = {
  label: string
  value: string
  icon: React.ComponentType<{
    className?: string
  }>
}


export function ComboBoxResponsive<T extends ComboItem>(
  {
    items,
    selectedItem: selectedItemProp,
    setSelectedItem: setSelectedItemProp,
    placeholder,
    className,
    ...rest
  }: {
      items: T[]
      selectedItem?: T | null
      setSelectedItem?: (item: T | null) => void
  } & InputProps
) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useIsDesktop()
  const [selectedItemInternal, setSelectedItemInternal] = React.useState<T | null>(
    null
  )

  const selectedItem = selectedItemProp === undefined ? selectedItemInternal : selectedItemProp
  const setSelectedItem = setSelectedItemProp ? setSelectedItemProp : setSelectedItemInternal

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            {selectedItem?.icon ? <selectedItem.icon className='mr-2 h-4 w-4 absolute top-3 left-3' /> : <ChevronsUpDown className='mr-2 h-4 w-4 absolute top-3 left-3 text-muted-foreground' />}
            <Input {...rest} className={cn("w-[150px] justify-start cursor-pointer pl-9", className)} value={selectedItem?.label ?? ""} placeholder={placeholder ?? "Select"} readOnly />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ItemList items={items} setOpen={setOpen} setSelectedItem={setSelectedItem} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="relative">
          {selectedItem?.icon ? <selectedItem.icon className='mr-2 h-4 w-4 absolute top-3 left-3' /> : <ChevronsUpDown className='mr-2 h-4 w-4 absolute top-3 left-3 text-muted-foreground' />}
          <Input {...rest} className={cn("w-[150px] justify-start cursor-pointer pl-9", className)} value={selectedItem?.label ?? ""} placeholder={placeholder ?? "Select"} readOnly />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 p-2">
          <ItemList items={items} setOpen={setOpen} setSelectedItem={setSelectedItem} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ItemList<T extends ComboItem>({
  items,
  setOpen,
  setSelectedItem,
}: {
  items: T[]
  setOpen: (open: boolean) => void
  setSelectedItem: (item: T | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={(value) => {
                setSelectedItem(
                  items.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
            >
              <item.icon className='mr-2 h-4 w-4' />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
