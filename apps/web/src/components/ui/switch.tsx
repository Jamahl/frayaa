"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

// [MIGRATED TO PLAIN CSS] Removed cn utility. Use plain CSS class names instead.

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={["switch", className].filter(Boolean).join(" ")}

      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={["switch-thumb", className].filter(Boolean).join(" ")}

      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
