import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from '@mui/material'
import { Question } from '../App'

type Props = {
  open: boolean
  selectedUser: Question | null
  description: string
  onDescriptionChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

export const QueryCreationDialog: React.FC<Props> = ({
  open,
  selectedUser,
  description,
  onDescriptionChange,
  onClose,
  onSubmit
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>User Details</DialogTitle>
    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography><strong>Question:</strong> {selectedUser?.question}</Typography>
      <Typography><strong>Answer:</strong> {selectedUser?.answer}</Typography>
      <TextField
        label="Add Description"
        variant="outlined"
        fullWidth
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
      <Button onClick={onSubmit} variant="contained">Create</Button>
    </DialogActions>
  </Dialog>
)
