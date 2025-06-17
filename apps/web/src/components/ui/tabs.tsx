"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import "./tabs.css";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={["tabs", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={["tabs-list", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={["tabs-trigger", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={["tabs-content", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
