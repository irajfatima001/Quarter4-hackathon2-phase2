import * as React from "react"
import { cn } from "@/lib/utils"

type SelectProps<T extends string> = {
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  children: React.ReactNode
  className?: string
}

const Select = <T extends string>({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: SelectProps<T>) => {
  return (
    <select
      value={value ?? defaultValue}
      onChange={(e) => onValueChange?.(e.target.value as T)}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        className
      )}
    >
      {children}
    </select>
  )
}

const SelectItem = ({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) => {
  return <option value={value}>{children}</option>
}

export { Select, SelectItem }
