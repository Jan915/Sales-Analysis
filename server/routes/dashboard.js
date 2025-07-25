const express = require('express');
const db = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get dashboard overview statistics
router.get('/stats', (req, res) => {
  const queries = {
    totalStudents: 'SELECT COUNT(*) as count FROM students WHERE status = "active"',
    totalCourses: 'SELECT COUNT(*) as count FROM courses',
    enrollmentThisMonth: `
      SELECT COUNT(*) as count FROM students 
      WHERE DATE(enrollment_date) >= DATE('now', 'start of month')
    `,
    averageGPA: 'SELECT AVG(gpa) as avg FROM students WHERE gpa > 0',
    recentEnrollments: `
      SELECT COUNT(*) as count FROM student_courses 
      WHERE DATE(enrollment_date) >= DATE('now', '-7 days')
    `
  };

  const promises = Object.entries(queries).map(([key, query]) => {
    return new Promise((resolve, reject) => {
      db.get(query, [], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ [key]: result.count !== undefined ? result.count : result.avg });
        }
      });
    });
  });

  Promise.all(promises)
    .then(results => {
      const stats = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      
      // Format average GPA
      if (stats.averageGPA) {
        stats.averageGPA = parseFloat(stats.averageGPA).toFixed(2);
      } else {
        stats.averageGPA = '0.00';
      }

      res.json(stats);
    })
    .catch(err => {
      console.error('Dashboard stats error:', err);
      res.status(500).json({ message: 'Error fetching dashboard statistics' });
    });
});

// Get recent students (last 10 registered)
router.get('/recent-students', (req, res) => {
  const query = `
    SELECT id, student_id, first_name, last_name, email, enrollment_date, profile_image
    FROM students 
    ORDER BY created_at DESC 
    LIMIT 10
  `;

  db.all(query, [], (err, students) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching recent students' });
    }
    res.json(students);
  });
});

// Get enrollment trends (monthly data for the last 6 months)
router.get('/enrollment-trends', (req, res) => {
  const query = `
    SELECT 
      strftime('%Y-%m', enrollment_date) as month,
      COUNT(*) as count
    FROM students 
    WHERE enrollment_date >= DATE('now', '-6 months')
    GROUP BY strftime('%Y-%m', enrollment_date)
    ORDER BY month ASC
  `;

  db.all(query, [], (err, trends) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching enrollment trends' });
    }
    res.json(trends);
  });
});

// Get grade distribution
router.get('/grade-distribution', (req, res) => {
  const query = `
    SELECT 
      CASE 
        WHEN gpa >= 3.5 THEN 'A (3.5-4.0)'
        WHEN gpa >= 3.0 THEN 'B (3.0-3.4)'
        WHEN gpa >= 2.5 THEN 'C (2.5-2.9)'
        WHEN gpa >= 2.0 THEN 'D (2.0-2.4)'
        WHEN gpa > 0 THEN 'F (0.0-1.9)'
        ELSE 'No Grade'
      END as grade_range,
      COUNT(*) as count
    FROM students 
    GROUP BY grade_range
    ORDER BY 
      CASE grade_range 
        WHEN 'A (3.5-4.0)' THEN 1
        WHEN 'B (3.0-3.4)' THEN 2
        WHEN 'C (2.5-2.9)' THEN 3
        WHEN 'D (2.0-2.4)' THEN 4
        WHEN 'F (0.0-1.9)' THEN 5
        ELSE 6
      END
  `;

  db.all(query, [], (err, distribution) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching grade distribution' });
    }
    res.json(distribution);
  });
});

// Get course enrollment statistics
router.get('/course-enrollments', (req, res) => {
  const query = `
    SELECT 
      c.course_name,
      c.course_code,
      COUNT(sc.student_id) as enrolled_students,
      c.instructor
    FROM courses c
    LEFT JOIN student_courses sc ON c.id = sc.course_id
    GROUP BY c.id, c.course_name, c.course_code, c.instructor
    ORDER BY enrolled_students DESC
    LIMIT 10
  `;

  db.all(query, [], (err, enrollments) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching course enrollments' });
    }
    res.json(enrollments);
  });
});

// Get attendance overview
router.get('/attendance-overview', (req, res) => {
  const query = `
    SELECT 
      DATE(attendance_date) as date,
      status,
      COUNT(*) as count
    FROM attendance 
    WHERE attendance_date >= DATE('now', '-30 days')
    GROUP BY DATE(attendance_date), status
    ORDER BY date DESC
  `;

  db.all(query, [], (err, attendance) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching attendance data' });
    }

    // Group by date and calculate percentages
    const attendanceByDate = {};
    attendance.forEach(record => {
      if (!attendanceByDate[record.date]) {
        attendanceByDate[record.date] = { date: record.date, present: 0, absent: 0, late: 0, total: 0 };
      }
      attendanceByDate[record.date][record.status] = record.count;
      attendanceByDate[record.date].total += record.count;
    });

    // Convert to array and add percentages
    const attendanceData = Object.values(attendanceByDate).map(day => ({
      ...day,
      presentRate: day.total > 0 ? ((day.present / day.total) * 100).toFixed(1) : 0
    }));

    res.json(attendanceData);
  });
});

// Get students by status
router.get('/student-status', (req, res) => {
  const query = `
    SELECT 
      status,
      COUNT(*) as count
    FROM students 
    GROUP BY status
  `;

  db.all(query, [], (err, statusData) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching student status data' });
    }
    res.json(statusData);
  });
});

// Get top performing students
router.get('/top-students', (req, res) => {
  const query = `
    SELECT 
      id, student_id, first_name, last_name, email, gpa, profile_image
    FROM students 
    WHERE gpa > 0
    ORDER BY gpa DESC 
    LIMIT 10
  `;

  db.all(query, [], (err, students) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching top students' });
    }
    res.json(students);
  });
});

module.exports = router;