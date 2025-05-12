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

type Question = {
  id: string
  question: string
  answer: string
}

type Query = {
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Question</strong></TableCell>
                <TableCell><strong>Answer</strong></TableCell>
                <TableCell align="right"><strong>Query</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {formData.map((item) => {
              const relatedQuery = queries.find((q) => q.formDataId === item.id)
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.question}</TableCell>
                  <TableCell>{item.answer}</TableCell>
                  <TableCell align="right">
                    {relatedQuery &&
                    <Button variant="contained" color={relatedQuery.status === 'Open' ? 'error' : 'success'} sx={{width: "100%"}} onClick={() => openQueryView(relatedQuery)}>
                      {relatedQuery.status}
                    </Button>}
                    {!relatedQuery &&
                    <Button variant="outlined" sx={{width: "100%"}} onClick={() => openModal(item)}>
                      Create
                    </Button>}
                  </TableCell>
                </TableRow>
              )
            })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Query Creation */}
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography><strong>Question:</strong> {selectedUser?.question}</Typography>
          <Typography><strong>Answer:</strong> {selectedUser?.answer}</Typography>
          <TextField
            label="Add Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Query View */}
      <Dialog open={queryViewOpen} onClose={closeQueryView} maxWidth="sm" fullWidth>
        <DialogTitle>Query | {selectedQuery?.title}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            backgroundColor:
              selectedQuery?.status === 'Resolved' ? '#e6f4ea' : '#fdecea', // green or red background
          }}
        >
          <Typography>
            <strong>Status:</strong> {selectedQuery?.status}
          </Typography>
          <Typography>
            <strong>Created At:</strong>{' '}
            {selectedQuery?.createdAt ? new Date(selectedQuery.createdAt).toLocaleString() : 'N/A'}
          </Typography>
          {selectedQuery?.status === 'Open' && (
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1 }}
              onClick={() => handleMarkResolved(selectedQuery?.id)}
            >
              Resolve
            </Button>
          )}

        </Paper>
          <Typography>
            <strong>Description:</strong> {selectedQuery?.description}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeQueryView}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default App
