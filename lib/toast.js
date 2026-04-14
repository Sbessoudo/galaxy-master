/**
 * Singleton toast API — works in any client component without context.
 * Toaster component registers the emit fn on mount.
 */

let _emit = null

export function _registerToastEmitter(fn) {
  _emit = fn
}

function fire(type, message) {
  if (typeof window === 'undefined') return
  if (_emit) {
    _emit({ type, message })
  }
}

export const toast = {
  success: (message) => fire('success', message),
  error:   (message) => fire('error',   message),
  info:    (message) => fire('info',    message),
}
