const db = require('./init');

// Sample students data
const sampleStudents = [
  {
    student_id: 'STU2024001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    date_of_birth: '2000-05-15',
    gender: 'male',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zip_code: '62701',
    emergency_contact_name: 'Jane Doe',
    emergency_contact_phone: '(555) 987-6543',
    enrollment_date: '2024-01-15',
    grade_level: 'Freshman',
    gpa: 3.8,
    status: 'active'
  },
  {
    student_id: 'STU2024002',
    first_name: 'Emily',
    last_name: 'Johnson',
    email: 'emily.johnson@email.com',
    phone: '(555) 234-5678',
    date_of_birth: '1999-12-03',
    gender: 'female',
    address: '456 Oak Avenue',
    city: 'Madison',
    state: 'WI',
    zip_code: '53703',
    emergency_contact_name: 'Robert Johnson',
    emergency_contact_phone: '(555) 876-5432',
    enrollment_date: '2024-01-15',
    grade_level: 'Sophomore',
    gpa: 3.9,
    status: 'active'
  },
  {
    student_id: 'STU2024003',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.brown@email.com',
    phone: '(555) 345-6789',
    date_of_birth: '2001-08-22',
    gender: 'male',
    address: '789 Pine Street',
    city: 'Austin',
    state: 'TX',
    zip_code: '73301',
    emergency_contact_name: 'Sarah Brown',
    emergency_contact_phone: '(555) 765-4321',
    enrollment_date: '2024-01-15',
    grade_level: 'Junior',
    gpa: 3.6,
    status: 'active'
  },
  {
    student_id: 'STU2024004',
    first_name: 'Sarah',
    last_name: 'Davis',
    email: 'sarah.davis@email.com',
    phone: '(555) 456-7890',
    date_of_birth: '2000-11-18',
    gender: 'female',
    address: '321 Elm Street',
    city: 'Portland',
    state: 'OR',
    zip_code: '97201',
    emergency_contact_name: 'Mark Davis',
    emergency_contact_phone: '(555) 654-3210',
    enrollment_date: '2024-01-15',
    grade_level: 'Sophomore',
    gpa: 3.7,
    status: 'active'
  },
  {
    student_id: 'STU2024005',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@email.com',
    phone: '(555) 567-8901',
    date_of_birth: '1999-04-10',
    gender: 'male',
    address: '654 Maple Drive',
    city: 'Denver',
    state: 'CO',
    zip_code: '80202',
    emergency_contact_name: 'Lisa Wilson',
    emergency_contact_phone: '(555) 543-2109',
    enrollment_date: '2024-01-15',
    grade_level: 'Senior',
    gpa: 3.95,
    status: 'active'
  }
];

// Function to insert sample students
function insertSampleStudents() {
  console.log('Adding sample students...');
  
  const insertStudent = db.prepare(`
    INSERT OR IGNORE INTO students (
      student_id, first_name, last_name, email, phone, date_of_birth,
      gender, address, city, state, zip_code, emergency_contact_name,
      emergency_contact_phone, enrollment_date, grade_level, gpa, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleStudents.forEach(student => {
    insertStudent.run([
      student.student_id,
      student.first_name,
      student.last_name,
      student.email,
      student.phone,
      student.date_of_birth,
      student.gender,
      student.address,
      student.city,
      student.state,
      student.zip_code,
      student.emergency_contact_name,
      student.emergency_contact_phone,
      student.enrollment_date,
      student.grade_level,
      student.gpa,
      student.status
    ]);
  });
  
  insertStudent.finalize();
  
  // Add some course enrollments
  console.log('Adding course enrollments...');
  const insertEnrollment = db.prepare(`
    INSERT OR IGNORE INTO student_courses (student_id, course_id, grade, enrollment_date)
    VALUES (?, ?, ?, ?)
  `);
  
  // Sample enrollments
  const enrollments = [
    [1, 1, 'A', '2024-01-15'], // John in CS101
    [1, 2, 'B+', '2024-01-15'], // John in MATH201
    [2, 1, 'A-', '2024-01-15'], // Emily in CS101
    [2, 3, 'A', '2024-01-15'], // Emily in ENG101
    [3, 2, 'B', '2024-01-15'], // Michael in MATH201
    [3, 4, 'A-', '2024-01-15'], // Michael in HIST150
    [4, 3, 'A', '2024-01-15'], // Sarah in ENG101
    [4, 5, 'B+', '2024-01-15'], // Sarah in BIO101
    [5, 1, 'A', '2024-01-15'], // David in CS101
    [5, 2, 'A', '2024-01-15'], // David in MATH201
    [5, 3, 'A-', '2024-01-15'], // David in ENG101
  ];
  
  enrollments.forEach(enrollment => {
    insertEnrollment.run(enrollment);
  });
  
  insertEnrollment.finalize();
  
  console.log('✅ Sample data added successfully!');
}

// Run if called directly
if (require.main === module) {
  insertSampleStudents();
}

module.exports = { insertSampleStudents };