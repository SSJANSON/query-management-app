import React, { useEffect, useState } from 'react'
import { Container, Typography, CircularProgress, Alert } from '@mui/material'
import { fetchQueries, createQuery, updateQueryStatus, deleteQuery } from './APIClients/QueryAPIClient'
import { fetchFormData } from './APIClients/FormDataAPIClient'
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
      const formJson = await fetchFormData()
      const queryJson = await fetchQueries()

      setFormData(formJson.formData)
      setQueries(queryJson.query)
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
      await createQuery(payload)
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
    try {
      await updateQueryStatus(selectedQueryId, "Resolved")
  
      console.log('Status successfully updated: Resolved')
    } catch (err) {
      console.error(err)
      alert('Error updating query. See console for details.')
    } finally {
      fetchData()
      closeQueryView()
    }
  }

  const handleDeleteQuery = async (selectedQueryId: string | undefined) => {
    try {
      console.log(selectedQueryId)
      await deleteQuery(selectedQueryId)
      console.log('Query successfully deleted.')
    } catch (err) {
      console.error(err)
      alert('Error deleting query. See console for details.')
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

      <QueryCreationDialog
        open={modalOpen}
        selectedUser={selectedUser}
        description={description}
        onDescriptionChange={setDescription}
        onClose={closeModal}
        onSubmit={handleCreate}
      />

      <QueryViewDialog
        open={queryViewOpen}
        query={selectedQuery}
        onClose={closeQueryView}
        onResolve={handleMarkResolved}
        onDelete={handleDeleteQuery}
      />
    </Container>
  )
}

export default App
