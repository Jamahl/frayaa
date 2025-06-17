import "./textarea.css";
import * as React from "react"

// [MIGRATED TO PLAIN CSS] Removed cn utility. Use plain CSS class names instead.

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={["textarea", className].filter(Boolean).join(" ")}

      {...props}
    />
  )
}

export { Textarea }
