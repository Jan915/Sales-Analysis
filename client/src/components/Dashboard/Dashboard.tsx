import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  People,
  School,
  TrendingUp,
  Grade,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { dashboardAPI, DashboardStats, Student } from '../../services/api';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [enrollmentTrends, setEnrollmentTrends] = useState<any[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<any[]>([]);
  const [courseEnrollments, setCourseEnrollments] = useState<any[]>([]);
  const [topStudents, setTopStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          statsRes,
          recentRes,
          trendsRes,
          gradesRes,
          coursesRes,
          topRes,
        ] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecentStudents(),
          dashboardAPI.getEnrollmentTrends(),
          dashboardAPI.getGradeDistribution(),
          dashboardAPI.getCourseEnrollments(),
          dashboardAPI.getTopStudents(),
        ]);

        setStats(statsRes.data);
        setRecentStudents(recentRes.data);
        setEnrollmentTrends(trendsRes.data);
        setGradeDistribution(gradesRes.data);
        setCourseEnrollments(coursesRes.data);
        setTopStudents(topRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={<People sx={{ color: 'white' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Courses"
            value={stats?.totalCourses || 0}
            icon={<School sx={{ color: 'white' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="This Month"
            value={stats?.enrollmentThisMonth || 0}
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average GPA"
            value={stats?.averageGPA || '0.00'}
            icon={<Grade sx={{ color: 'white' }} />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Enrollment Trends Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Enrollment Trends (Last 6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Grade Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Grade Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  dataKey="count"
                  nameKey="grade_range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Course Enrollments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Popular Courses
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={courseEnrollments.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course_code" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled_students" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Students */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Recent Students
            </Typography>
            <List>
              {recentStudents.slice(0, 5).map((student) => (
                <ListItem key={student.id}>
                  <ListItemAvatar>
                    <Avatar src={student.profile_image ? `/uploads/${student.profile_image}` : undefined}>
                      {student.first_name[0]}{student.last_name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${student.first_name} ${student.last_name}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {student.email}
                        </Typography>
                        <Chip
                          label={student.status}
                          size="small"
                          color={student.status === 'active' ? 'success' : 'default'}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Top Students */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Students
            </Typography>
            <Grid container spacing={2}>
              {topStudents.slice(0, 6).map((student) => (
                <Grid item xs={12} sm={6} md={4} key={student.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar 
                          src={student.profile_image ? `/uploads/${student.profile_image}` : undefined}
                          sx={{ mr: 2 }}
                        >
                          {student.first_name[0]}{student.last_name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {student.first_name} {student.last_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.student_id}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">GPA:</Typography>
                        <Chip 
                          label={student.gpa.toFixed(2)} 
                          color="primary" 
                          size="small" 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}