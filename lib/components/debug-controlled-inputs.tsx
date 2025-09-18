"use client"

import { useEffect } from "react"

export function DebugControlledInputs() {
  useEffect(() => {
    // Override console.error to catch controlled/uncontrolled input warnings
    const originalError = console.error
    console.error = (...args) => {
      const message = args[0]
      if (typeof message === 'string' && message.includes('controlled input to be uncontrolled')) {
        console.warn('🚨 CONTROLLED INPUT WARNING DETECTED:', ...args)
        // Log stack trace to help identify the source
        console.trace('Stack trace:')
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return null
}
