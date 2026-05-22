// ===== Student Portal - Version 2 (View + Add Students) =====
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.use(express.json());                          // Parse JSON bodies

// --- In-memory student data ---
const students = [
  { id: 1, name: 'Aarav Sharma',   course: 'Computer Science' },
  { id: 2, name: 'Priya Patel',    course: 'Data Science' },
  { id: 3, name: 'Rohit Kumar',    course: 'DevOps Engineering' },
  { id: 4, name: 'Sneha Gupta',    course: 'Cloud Computing' },
  { id: 5, name: 'Vikram Singh',   course: 'Cyber Security' }
];

// Helper: generate next ID
function nextId() {
  return students.length > 0
    ? Math.max(...students.map(s => s.id)) + 1
    : 1;
}

// ===== ROUTES =====

// Health check route (for Kubernetes liveness/readiness probes)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    version: '2.0.0',
    uptime: process.uptime()
  });
});

// Home page - display student list + add form
app.get('/', (req, res) => {
  const successMsg = req.query.added
    ? `<div class="success-msg">✅ Student "<strong>${decodeURIComponent(req.query.added)}</strong>" added successfully!</div>`
    : '';

  // Build table rows
  let tableRows = '';

  if (students.length === 0) {
    tableRows = `
      <tr>
        <td colspan="3">
          <div class="empty-state">
            <span>📭</span>
            No students found. Add one below!
          </div>
        </td>
      </tr>`;
  } else {
    students.forEach((s) => {
      tableRows += `
        <tr>
          <td>${s.id}</td>
          <td>${s.name}</td>
          <td>${s.course}</td>
        </tr>`;
    });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Student Portal - View and add students">
  <title>Student Portal v2</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>

  <nav class="navbar">
    <h1>🎓 Student Portal</h1>
    <span class="version-badge">v2.0 — View + Add</span>
  </nav>

  <div class="container">

    <!-- ====== Add Student Form (NEW in v2) ====== -->
    <div class="card">
      <h2>➕ Add New Student</h2>
      ${successMsg}
      <form action="/add" method="POST" id="add-student-form">
        <div class="form-group">
          <label for="name">Student Name</label>
          <input type="text" id="name" name="name" placeholder="e.g. John Doe" required>
        </div>
        <div class="form-group">
          <label for="course">Course</label>
          <input type="text" id="course" name="course" placeholder="e.g. Cloud Computing" required>
        </div>
        <button type="submit" class="btn btn-primary" id="submit-btn">Add Student</button>
      </form>
    </div>

    <!-- ====== Student List ====== -->
    <div class="card">
      <h2>📋 Student List (${students.length} students)</h2>
      <table class="student-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>

  </div>

  <div class="footer">
    Student Portal v2.0 &mdash; DevOps CI/CD Demo
  </div>

</body>
</html>`;

  res.send(html);
});

// POST route - add a new student (NEW in v2)
app.post('/add', (req, res) => {
  const { name, course } = req.body;

  if (name && course) {
    students.push({
      id: nextId(),
      name: name.trim(),
      course: course.trim()
    });
    // Redirect back to home with success message
    res.redirect('/?added=' + encodeURIComponent(name.trim()));
  } else {
    res.status(400).send('Name and Course are required.');
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`✅ Student Portal v2 running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
