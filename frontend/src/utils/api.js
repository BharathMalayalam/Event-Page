const API_BASE = 'http://localhost:5000/api'
export const TOKEN_KEY = 'admin_token'

export async function apiFetch(path, options = {}) {
  const { headers, ...rest } = options
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...rest,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.message || 'Request failed')
  }

  return response.json()
}

export function formatDate(dateValue) {
  if (!dateValue) return 'TBA'
  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
