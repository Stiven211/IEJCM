const isDev = import.meta.env.DEV

export interface LogContext {
  [key: string]: unknown
}

export function logError(error: unknown, context?: LogContext) {
  const message = error instanceof Error ? error.message : String(error)
  const details = error instanceof Error ? { name: error.name, stack: error.stack } : {}

  if (isDev) {
    console.error(message, { ...details, ...context })
  }

  if (typeof globalThis !== 'undefined' && (globalThis as Record<string, unknown>).__ERROR_REPORTER__) {
    ;(globalThis as Record<string, (error: unknown) => void>).__ERROR_REPORTER__(error)
  }
}

export function logWarning(message: string, context?: LogContext) {
  if (isDev) {
    console.warn(message, context)
  }
}
