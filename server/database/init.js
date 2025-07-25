const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'students.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table for authentication
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Students table
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    enrollment_date DATE NOT NULL,
    grade_level TEXT,
    gpa REAL DEFAULT 0.0,
    status TEXT DEFAULT 'active',
    profile_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Courses table
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT UNIQUE NOT NULL,
    course_name TEXT NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    instructor TEXT,
    semester TEXT,
    year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Student_Courses junction table for many-to-many relationship
  db.run(`CREATE TABLE IF NOT EXISTS student_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    course_id INTEGER,
    grade TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    completion_status TEXT DEFAULT 'enrolled',
    FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id)
  )`);

  // Attendance table
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    course_id INTEGER,
    attendance_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
  )`);

  // Create default admin user
  const defaultPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (username, email, password, role) 
          VALUES ('admin', 'admin@student-mgmt.com', ?, 'admin')`, [defaultPassword]);

  // Insert some sample courses
  const sampleCourses = [
    ['CS101', 'Introduction to Computer Science', 'Basic programming concepts and problem solving', 3, 'Dr. Smith', 'Fall', 2024],
    ['MATH201', 'Calculus I', 'Differential and integral calculus', 4, 'Prof. Johnson', 'Fall', 2024],
    ['ENG101', 'English Composition', 'Writing and communication skills', 3, 'Dr. Williams', 'Fall', 2024],
    ['HIST150', 'World History', 'Survey of world civilizations', 3, 'Prof. Brown', 'Fall', 2024],
    ['BIO101', 'General Biology', 'Introduction to biological sciences', 4, 'Dr. Davis', 'Fall', 2024]
  ];

  const insertCourse = db.prepare(`INSERT OR IGNORE INTO courses 
    (course_code, course_name, description, credits, instructor, semester, year) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`);

  sampleCourses.forEach(course => {
    insertCourse.run(course);
  });
  insertCourse.finalize();

  console.log('✅ Database initialized successfully');
});

module.exports = db;