import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)

// Make sure to export the worker for type safety
declare global {
  interface Window {
    msw: {
      worker: typeof worker
    }
  }
}

window.msw = { worker }
