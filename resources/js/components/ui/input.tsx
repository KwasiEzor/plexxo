import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-xl border border-black/5 bg-white/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring/30 transition-all disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
