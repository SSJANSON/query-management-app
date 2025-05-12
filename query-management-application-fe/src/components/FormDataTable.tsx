import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material'
import { Question, Query } from '../App'

type Props = {
  formData: Question[]
  queries: Query[]
  onCreateClick: (user: Question) => void
  onViewClick: (query: Query) => void
}

export const FormDataTable: React.FC<Props> = ({ formData, queries, onCreateClick, onViewClick }) => (
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
                {relatedQuery ? (
                  <Button
                    variant="contained"
                    color={relatedQuery.status === 'Open' ? 'error' : 'success'}
                    sx={{ width: '100%' }}
                    onClick={() => onViewClick(relatedQuery)}
                  >
                    {relatedQuery.status}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    sx={{ width: '100%' }}
                    onClick={() => onCreateClick(item)}
                  >
                    Create
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  </TableContainer>
)
