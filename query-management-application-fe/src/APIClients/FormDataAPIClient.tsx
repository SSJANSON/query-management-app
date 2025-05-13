const API_BASE = 'http://127.0.0.1:8080'

export const fetchFormData = async () => {
    const res = await fetch(`${API_BASE}/form-data`)
    if (!res.ok) throw new Error(`Failed to fetch form data: ${res.status}`)
        const json = await res.json()
        return json.data
}