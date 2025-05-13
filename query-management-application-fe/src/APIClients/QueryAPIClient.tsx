const API_BASE = 'http://127.0.0.1:8080'

export const fetchQueries = async () => {
    const res = await fetch(`${API_BASE}/query`)
    if (!res.ok) throw new Error(`Failed to fetch queries: ${res.status}`)
        const json = await res.json()
        return json.data
}

export const createQuery = async (payload: any) => {
    const res = await fetch(`${API_BASE}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Failed to post query: ${res.status}`)
        const json = await res.json()
        return json.data
}

export const updateQueryStatus = async (id: string | undefined, status: string) => {
    const res = await fetch(`${API_BASE}/query/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error(`Failed to update query: ${res.status}`)
        const json = await res.json()
        return json.data
}

export const deleteQuery = async (id: string | undefined) => {
    const res = await fetch(`${API_BASE}/query/${id}`, {method: 'DELETE'})
    if (!res.ok) throw new Error(`Failed to delete query: ${res.status}`)
        const json = await res.json()
        return json.data
}