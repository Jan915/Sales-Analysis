const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const db = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'student-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Apply authentication to all routes
router.use(authenticateToken);

// Get all students with pagination and search
router.get('/', (req, res) => {
  const { page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
  const offset = (page - 1) * limit;
  
  let searchQuery = '';
  let params = [];
  
  if (search) {
    searchQuery = `WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR student_id LIKE ?`;
    const searchTerm = `%${search}%`;
    params = [searchTerm, searchTerm, searchTerm, searchTerm];
  }
  
  const countQuery = `SELECT COUNT(*) as total FROM students ${searchQuery}`;
  const dataQuery = `SELECT * FROM students ${searchQuery} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
  
  // Get total count
  db.get(countQuery, params, (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    
    // Get paginated data
    db.all(dataQuery, [...params, parseInt(limit), parseInt(offset)], (err, students) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      
      res.json({
        students,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult.total / limit),
          totalStudents: countResult.total,
          hasNext: (page * limit) < countResult.total,
          hasPrev: page > 1
        }
      });
    });
  });
});

// Get single student by ID
router.get('/:id', (req, res) => {
  const studentId = req.params.id;
  
  db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, student) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get student's courses
    db.all(`
      SELECT c.*, sc.grade, sc.enrollment_date, sc.completion_status 
      FROM courses c 
      JOIN student_courses sc ON c.id = sc.course_id 
      WHERE sc.student_id = ?
    `, [studentId], (err, courses) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching courses' });
      }
      
      res.json({ ...student, courses });
    });
  });
});

// Create new student
router.post('/', upload.single('profileImage'), [
  body('student_id').notEmpty().withMessage('Student ID is required'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('enrollment_date').isISO8601().withMessage('Valid enrollment date is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const {
    student_id, first_name, last_name, email, phone, date_of_birth,
    gender, address, city, state, zip_code, emergency_contact_name,
    emergency_contact_phone, enrollment_date, grade_level, gpa, status = 'active'
  } = req.body;
  
  const profile_image = req.file ? req.file.filename : null;
  
  db.run(`
    INSERT INTO students (
      student_id, first_name, last_name, email, phone, date_of_birth,
      gender, address, city, state, zip_code, emergency_contact_name,
      emergency_contact_phone, enrollment_date, grade_level, gpa, status, profile_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    student_id, first_name, last_name, email, phone, date_of_birth,
    gender, address, city, state, zip_code, emergency_contact_name,
    emergency_contact_phone, enrollment_date, grade_level, gpa, status, profile_image
  ], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ message: 'Student ID or email already exists' });
      }
      return res.status(500).json({ message: 'Error creating student' });
    }
    
    res.status(201).json({
      message: 'Student created successfully',
      student: { id: this.lastID, student_id, first_name, last_name, email }
    });
  });
});

// Update student
router.put('/:id', upload.single('profileImage'), [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const studentId = req.params.id;
  const {
    first_name, last_name, email, phone, date_of_birth,
    gender, address, city, state, zip_code, emergency_contact_name,
    emergency_contact_phone, grade_level, gpa, status
  } = req.body;
  
  const profile_image = req.file ? req.file.filename : req.body.existing_image;
  
  db.run(`
    UPDATE students SET
      first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?,
      gender = ?, address = ?, city = ?, state = ?, zip_code = ?,
      emergency_contact_name = ?, emergency_contact_phone = ?, grade_level = ?,
      gpa = ?, status = ?, profile_image = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    first_name, last_name, email, phone, date_of_birth,
    gender, address, city, state, zip_code, emergency_contact_name,
    emergency_contact_phone, grade_level, gpa, status, profile_image, studentId
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating student' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ message: 'Student updated successfully' });
  });
});

// Delete student
router.delete('/:id', (req, res) => {
  const studentId = req.params.id;
  
  db.run('DELETE FROM students WHERE id = ?', [studentId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting student' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  });
});

// Enroll student in course
router.post('/:id/courses', [
  body('course_id').isInt().withMessage('Valid course ID is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id: student_id } = req.params;
  const { course_id } = req.body;
  
  db.run(
    'INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)',
    [student_id, course_id],
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ message: 'Student already enrolled in this course' });
        }
        return res.status(500).json({ message: 'Error enrolling student' });
      }
      
      res.status(201).json({ message: 'Student enrolled successfully' });
    }
  );
});

// Update student grade in course
router.put('/:id/courses/:courseId', [
  body('grade').notEmpty().withMessage('Grade is required')
], (req, res) => {
  const { id: student_id, courseId: course_id } = req.params;
  const { grade, completion_status = 'enrolled' } = req.body;
  
  db.run(
    'UPDATE student_courses SET grade = ?, completion_status = ? WHERE student_id = ? AND course_id = ?',
    [grade, completion_status, student_id, course_id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating grade' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }
      
      res.json({ message: 'Grade updated successfully' });
    }
  );
});

// Get student statistics
router.get('/:id/stats', (req, res) => {
  const studentId = req.params.id;
  
  // Get course count, GPA, and attendance stats
  const queries = [
    'SELECT COUNT(*) as total_courses FROM student_courses WHERE student_id = ?',
    'SELECT AVG(CASE WHEN grade != "" THEN CAST(grade as REAL) END) as avg_grade FROM student_courses WHERE student_id = ?',
    'SELECT COUNT(*) as total_attendance, SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present_count FROM attendance WHERE student_id = ?'
  ];
  
  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.get(query, [studentId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }))
  .then(results => {
    const [courses, grades, attendance] = results;
    const attendanceRate = attendance.total_attendance > 0 
      ? (attendance.present_count / attendance.total_attendance * 100).toFixed(1)
      : 0;
    
    res.json({
      totalCourses: courses.total_courses,
      averageGrade: grades.avg_grade ? parseFloat(grades.avg_grade).toFixed(2) : 'N/A',
      attendanceRate: `${attendanceRate}%`,
      totalClasses: attendance.total_attendance
    });
  })
  .catch(err => {
    res.status(500).json({ message: 'Error fetching statistics' });
  });
});

module.exports = router;