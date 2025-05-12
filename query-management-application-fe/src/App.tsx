import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material'
import { QueryCreationDialog } from './components/QueryCreationDialog'
import { QueryViewDialog } from './components/QueryViewDialog'
import { FormDataTable } from './components/FormDataTable'

export type Question = {
  id: string
  question: string
  answer: string
}

export type Query = {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  status: string
  formDataId: string
}

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [queryViewOpen, setQueryViewOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Question | null>(null)
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [description, setDescription] = useState('')
  const [formData, setFormData] = useState<Question[]>([])
  const [queries, setQueries] = useState<Query[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchData = async () => {
    try {
      const [formRes, queryRes] = await Promise.all([
        fetch('http://127.0.0.1:8080/form-data'),
        fetch('http://127.0.0.1:8080/query'),
      ])

      if (!formRes.ok || !queryRes.ok) {
        throw new Error(`HTTP error: ${formRes.status}, ${queryRes.status}`)
      }

      const formJson = await formRes.json()
      const queryJson = await queryRes.json()

      setFormData(formJson.data.formData)
      setQueries(queryJson.data.query)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to fetch data.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    

    fetchData()
  }, [])

  const openModal = (user: Question) => {
    setSelectedUser(user)
    setDescription('') // Reset description input
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedUser(null)
    setDescription('')
  }

  const openQueryView = (relatedQuery: Query) => {
    setSelectedQuery(relatedQuery)
    setDescription('') // Reset description input
    setQueryViewOpen(true)
  }

  const closeQueryView = () => {
    setQueryViewOpen(false)
    setSelectedQuery(null)
    setDescription('')
  }

  const handleCreate = async () => {
    if (!description.trim()) return
  
    const payload = {
      createdAt: new Date().toISOString(),
      title: selectedUser?.question,
      description: description.trim(),
      status: "Open",
      formDataId: selectedUser?.id

    }
  
    try {
      const response = await fetch('http://127.0.0.1:8080/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to post description: ${response.status}`)
      }
  
      console.log('Description successfully posted:', payload)
    } catch (err) {
      console.error(err)
      alert('Error posting description. See console for details.')
    } finally {
      await fetchData()
      closeModal()

    }
  }

  const handleMarkResolved = async (selectedQueryId: string | undefined) => {

    console.log("hi")
    const payload = {
      status: "Resolved",
    }
    console.log(`http://127.0.0.1:8080/query/${selectedQueryId}`)
    try {
      const response = await fetch(`http://127.0.0.1:8080/query/${selectedQueryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to update query: ${response.status}`)
      }
  
      console.log('Description successfully updated:', payload)
    } catch (err) {
      console.error(err)
      alert('Error updating query. See console for details.')
    } finally {
      fetchData()
      closeQueryView()

    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>User Table</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <FormDataTable
          formData={formData}
          queries={queries}
          onCreateClick={openModal}
          onViewClick={openQueryView}
        />
      )}

      {/* Query Creation */}
      <QueryCreationDialog
        open={modalOpen}
        selectedUser={selectedUser}
        description={description}
        onDescriptionChange={setDescription}
        onClose={closeModal}
        onSubmit={handleCreate}
      />

      {/* Query View */}
      <QueryViewDialog
        open={queryViewOpen}
        query={selectedQuery}
        onClose={closeQueryView}
        onResolve={handleMarkResolved}
      />
    </Container>
  )
}

export default App
