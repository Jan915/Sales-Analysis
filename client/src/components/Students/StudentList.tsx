import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Grid,
  InputAdornment,
  Fab,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { studentAPI, Student } from '../../services/api';
import { format } from 'date-fns';

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    student: Student | null;
  }>({ open: false, student: null });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getStudents({
        page: page + 1,
        limit: pageSize,
        search: searchTerm,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      });
      
      setStudents(response.data.students);
      setRowCount(response.data.pagination.totalStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, pageSize, searchTerm]);

  const handleDeleteClick = (student: Student) => {
    setDeleteDialog({ open: true, student });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.student) {
      try {
        await studentAPI.deleteStudent(deleteDialog.student.id);
        setDeleteDialog({ open: false, student: null });
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'profile_image',
      headerName: 'Photo',
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.value ? `http://localhost:5000/uploads/${params.value}` : undefined}
          sx={{ width: 40, height: 40 }}
        >
          {params.row.first_name[0]}{params.row.last_name[0]}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'student_id',
      headerName: 'Student ID',
      width: 120,
      fontWeight: 'bold',
    },
    {
      field: 'full_name',
      headerName: 'Full Name',
      width: 200,
      valueGetter: (params) => `${params.row.first_name} ${params.row.last_name}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Email fontSize="small" color="action" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      renderCell: (params) => params.value ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Phone fontSize="small" color="action" />
          {params.value}
        </Box>
      ) : '-',
    },
    {
      field: 'grade_level',
      headerName: 'Grade',
      width: 100,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'gpa',
      headerName: 'GPA',
      width: 80,
      renderCell: (params) => (
        <Chip
          label={params.value?.toFixed(2) || '0.00'}
          color={params.value >= 3.5 ? 'success' : params.value >= 3.0 ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'enrollment_date',
      headerName: 'Enrolled',
      width: 120,
      renderCell: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={() => navigate(`/students/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/students/${params.id}/edit`)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Students
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/students/new')}
        >
          Add Student
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search students by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={students}
          columns={columns}
          rowCount={rowCount}
          loading={loading}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={{ page, pageSize }}
          paginationMode="server"
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, student: null })}
      >
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {deleteDialog.student?.first_name} {deleteDialog.student?.last_name}? 
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, student: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' },
        }}
        onClick={() => navigate('/students/new')}
      >
        <Add />
      </Fab>
    </Box>
  );
}