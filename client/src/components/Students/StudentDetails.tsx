import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Email,
  Phone,
  Home,
  ContactEmergency,
  School,
  Grade,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { studentAPI, Student } from '../../services/api';
import { format } from 'date-fns';

export default function StudentDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStudentDetails(parseInt(id));
    }
  }, [id]);

  const fetchStudentDetails = async (studentId: number) => {
    try {
      const [studentRes, statsRes] = await Promise.all([
        studentAPI.getStudent(studentId),
        studentAPI.getStudentStats(studentId),
      ]);
      
      setStudent(studentRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!student) {
    return (
      <Box>
        <Typography variant="h6">Student not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/students')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            Student Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/students/${id}/edit`)}
        >
          Edit Student
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={student.profile_image ? `http://localhost:5000/uploads/${student.profile_image}` : undefined}
              sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
            >
              {student.first_name[0]}{student.last_name[0]}
            </Avatar>
            
            <Typography variant="h5" gutterBottom>
              {student.first_name} {student.last_name}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Student ID: {student.student_id}
            </Typography>
            
            <Chip
              label={student.status}
              color={student.status === 'active' ? 'success' : 'default'}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                      <Typography variant="h6">{stats?.totalCourses || 0}</Typography>
                      <Typography variant="body2" color="text.secondary">Courses</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                      <Typography variant="h6">{student.gpa.toFixed(2)}</Typography>
                      <Typography variant="body2" color="text.secondary">GPA</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Details Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Contact Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1 }} />
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{student.email}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{student.phone || 'Not provided'}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Home fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Address</Typography>
                        <Typography variant="body1">
                          {student.address ? (
                            <>
                              {student.address}<br />
                              {student.city && student.state && `${student.city}, ${student.state}`}
                              {student.zip_code && ` ${student.zip_code}`}
                            </>
                          ) : (
                            'Not provided'
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ContactEmergency fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
                        <Typography variant="body1">
                          {student.emergency_contact_name || 'Not provided'}
                          {student.emergency_contact_phone && (
                            <><br />{student.emergency_contact_phone}</>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Academic Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <School sx={{ mr: 1 }} />
                  Academic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Enrollment Date</Typography>
                    <Typography variant="body1" gutterBottom>
                      {format(new Date(student.enrollment_date), 'MMMM dd, yyyy')}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Grade Level</Typography>
                    <Typography variant="body1" gutterBottom>
                      {student.grade_level || 'Not specified'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Current GPA</Typography>
                    <Typography variant="body1" gutterBottom>
                      <Chip
                        label={student.gpa.toFixed(2)}
                        color={student.gpa >= 3.5 ? 'success' : student.gpa >= 3.0 ? 'primary' : 'default'}
                        size="small"
                      />
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1" gutterBottom>
                      {student.date_of_birth ? format(new Date(student.date_of_birth), 'MMMM dd, yyyy') : 'Not provided'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Typography variant="body1" gutterBottom>
                      {student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Enrolled Courses */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Grade sx={{ mr: 1 }} />
                  Enrolled Courses
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {student.courses && student.courses.length > 0 ? (
                  <List>
                    {student.courses.map((course, index) => (
                      <React.Fragment key={course.id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1">
                                  {course.course_code} - {course.course_name}
                                </Typography>
                                {course.grade && (
                                  <Chip label={`Grade: ${course.grade}`} size="small" color="primary" />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {course.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Credits: {course.credits} | Instructor: {course.instructor}
                                </Typography>
                                {course.enrollment_date && (
                                  <Typography variant="body2" color="text.secondary">
                                    Enrolled: {format(new Date(course.enrollment_date), 'MMM dd, yyyy')}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < student.courses!.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No courses enrolled yet.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}