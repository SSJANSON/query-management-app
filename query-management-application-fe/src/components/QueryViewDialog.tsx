import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Paper } from '@mui/material'
import { Query } from '../App'

type Props = {
  open: boolean
  query: Query | null
  onClose: () => void
  onResolve: (id: string | undefined) => void
  onDelete: (id: string | undefined) => void
}

export const QueryViewDialog: React.FC<Props> = ({ open, query, onClose, onResolve, onDelete }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Query | {query?.title}</DialogTitle>
    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          backgroundColor: query?.status === 'Resolved' ? '#e6f4ea' : '#fdecea',
        }}
      >
        <Typography><strong>Status:</strong> {query?.status}</Typography>
        <Typography><strong>Created At:</strong> {query?.createdAt ? new Date(query.createdAt).toLocaleString() : 'N/A'}</Typography>
        {query?.status === 'Open' && (
          <Button variant="contained" color="success" sx={{ mt: 1 }} onClick={() => onResolve(query?.id)}>
            Resolve
          </Button>
        )}
      </Paper>
      <Typography><strong>Description:</strong> {query?.description}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
      <Button
        onClick={() => onDelete(query?.id)}
        color="error"
        variant="outlined"
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
)
