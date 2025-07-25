# Student Management System

A comprehensive web application for managing student data, built with React (TypeScript) frontend and Node.js/Express backend with SQLite database.

## 🚀 Features

### Dashboard
- Overview statistics (total students, courses, enrollments, average GPA)
- Interactive charts showing enrollment trends and grade distribution
- Recent students list and top performers
- Course enrollment statistics

### Student Management
- **CRUD Operations**: Create, Read, Update, Delete students
- **Advanced Search**: Search by name, email, or student ID
- **Pagination**: Efficient handling of large datasets
- **Profile Images**: Upload and manage student photos
- **Detailed Information**:
  - Personal details (name, email, phone, address)
  - Academic information (GPA, grade level, enrollment date)
  - Emergency contact information
  - Course enrollments and grades

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material-UI Components**: Modern and accessible UI
- **Data Grid**: Advanced table with sorting, filtering, and pagination
- **Form Validation**: Client and server-side validation
- **Image Upload**: Drag-and-drop profile image upload

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level access control
- **Input Validation**: Server-side validation with express-validator
- **File Upload Security**: Restricted file types and size limits

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components and styling
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization
- **Date-fns** for date formatting

### Backend
- **Node.js** with Express.js
- **SQLite3** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **express-validator** for input validation

## 📁 Project Structure

```
student-management-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Dashboard/  # Dashboard components
│   │   │   ├── Layout/     # Layout components
│   │   │   └── Students/   # Student management components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── database/           # Database initialization
│   ├── middleware/         # Express middleware
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── students.js    # Student CRUD routes
│   │   └── dashboard.js   # Dashboard data routes
│   ├── uploads/           # Uploaded files
│   └── index.js           # Server entry point
└── package.json           # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-management-system
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start them separately:
   # Backend (runs on port 5000)
   npm run server

   # Frontend (runs on port 3000)
   npm run client
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Default Login Credentials
- **Username**: admin
- **Password**: admin123

## 📊 Database Schema

### Tables
- **users**: Admin users for authentication
- **students**: Student information and academic data
- **courses**: Available courses
- **student_courses**: Student-course enrollments with grades
- **attendance**: Student attendance records

### Sample Data
The application comes with:
- Default admin user
- 5 sample courses (CS101, MATH201, ENG101, HIST150, BIO101)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/register` - Register new user (admin)

### Students
- `GET /api/students` - Get all students (with pagination/search)
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/:id/stats` - Get student statistics

### Dashboard
- `GET /api/dashboard/stats` - Get overview statistics
- `GET /api/dashboard/recent-students` - Get recent students
- `GET /api/dashboard/enrollment-trends` - Get enrollment trends
- `GET /api/dashboard/grade-distribution` - Get grade distribution
- `GET /api/dashboard/course-enrollments` - Get course enrollment data
- `GET /api/dashboard/top-students` - Get top performing students

## 🎨 Features in Detail

### Student Management
- **Add Student**: Comprehensive form with validation
- **Edit Student**: Update existing student information
- **View Student**: Detailed student profile with statistics
- **Delete Student**: Soft delete with confirmation
- **Search & Filter**: Real-time search across multiple fields
- **Export Data**: (Future enhancement)

### Dashboard Analytics
- **Real-time Statistics**: Live data updates
- **Visual Charts**: Enrollment trends, grade distribution
- **Performance Metrics**: GPA tracking, attendance rates
- **Quick Actions**: Direct links to student management

### File Management
- **Profile Pictures**: Upload and display student photos
- **File Validation**: Type and size restrictions
- **Secure Storage**: Protected file access

## 🔒 Security Features

- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection Protection**: Parameterized queries
- **File Upload Security**: Restricted file types and sizes
- **CORS Protection**: Configured for secure cross-origin requests

## 🚀 Deployment

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
REACT_APP_API_URL=http://localhost:5000/api
```

### Production Build
```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
NODE_ENV=production npm start
```

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🔄 Future Enhancements

- **Attendance Management**: Track student attendance
- **Grade Management**: Comprehensive grade tracking
- **Reporting**: Generate detailed reports
- **Email Notifications**: Automated email system
- **Parent Portal**: Parent access to student information
- **Document Management**: Store and manage student documents
- **Advanced Analytics**: More detailed statistics and insights
- **Import/Export**: CSV import/export functionality
- **Multi-tenancy**: Support for multiple schools/institutions

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **Database Issues**
   - Delete `server/database/students.db` to reset database
   - Restart the server to recreate with sample data

3. **File Upload Issues**
   - Check `server/uploads` directory exists
   - Verify file permissions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please email support@studentmgmt.com or create an issue in the repository.

---

**Student Management System** - Built with ❤️ for educational institutions
