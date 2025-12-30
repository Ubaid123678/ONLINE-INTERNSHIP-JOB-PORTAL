# Project Submission System Guide

## Overview
The project submission system allows students to upload their completed work for job applications, and clients can download and review the submitted projects.

## Features

### For Students (Users)
1. **Upload Project Work**
   - Students can upload project files once they complete the work for a job
   - Only available when application status is "shortlisted"
   - **One-time submission only** - cannot re-upload after submission
   - Supports multiple file formats: `.zip`, `.rar`, `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`
   - Maximum file size: 50MB
   - Optional description field to explain the submitted work

2. **Submission Process**
   - Navigate to Student Dashboard
   - Find the shortlisted application
   - Click "Submit Project" button
   - Select file and add description (optional)
   - Upload with progress indicator
   - View submission confirmation

3. **View Submission Status**
   - Submitted projects display in a card showing:
     - File name and size
     - Submission date and time
     - Project description
     - Success confirmation message

### For Clients (Recruiters)
1. **View Submitted Projects**
   - See all submitted projects in the "Applications" page
   - Project submission cards appear automatically when students upload
   - Clear indication of project completion status

2. **Download Projects**
   - One-click download button for each submitted project
   - File details displayed:
     - Original file name
     - File size
     - Submission timestamp
     - Student's project description
   - Secure download with authentication

## Technical Implementation

### Backend

#### API Endpoints

**Submit Project**
```
POST /api/applications/:id/submit-project
```
- Requires authentication
- Only students can submit to their own applications
- Validates one-time submission
- Maximum file size: 50MB
- Stores file in `uploads/projects/` directory

**Download Project**
```
GET /api/applications/:id/download-project
```
- Requires authentication
- Students can download their own submissions
- Clients can download submissions for their posted jobs
- Returns file as downloadable blob

#### Database Schema
```javascript
projectSubmission: {
  file: String,              // File path
  fileName: String,          // Original filename
  fileSize: Number,          // Size in bytes
  description: String,       // Optional description (max 1000 chars)
  submittedAt: Date,         // Submission timestamp
  isSubmitted: Boolean       // Submission status flag
}
```

### Frontend Components

#### ProjectSubmissionModal
- Modal dialog for uploading projects
- Features:
  - File input with drag-and-drop support
  - File type validation
  - Size limit enforcement (50MB)
  - Upload progress bar
  - Description text area
  - One-time submission warning

#### ProjectSubmissionCard
- Display component for submitted projects
- Shows for both students and clients
- Features:
  - File information display
  - Download button
  - Description section
  - Conditional messaging based on user role

## User Workflow

### Student Workflow
1. Apply for a job
2. Chat with recruiter
3. Application gets shortlisted
4. Complete the assigned work
5. Click "Submit Project" button
6. Upload project file with description
7. View confirmation
8. Client downloads and reviews

### Client Workflow
1. Post a job
2. Review applications
3. Chat with applicants
4. Shortlist suitable candidates
5. Wait for project submission
6. Receive notification when project uploaded
7. View submission details
8. Download and review the work
9. Provide feedback or proceed

## File Upload Restrictions

### Allowed File Types
- Archives: `.zip`, `.rar`
- Documents: `.pdf`, `.doc`, `.docx`
- Presentations: `.ppt`, `.pptx`

### Size Limits
- Maximum file size: 50MB
- Server-side validation
- Client-side pre-validation

### Security Features
- Authentication required for all operations
- Role-based access control
- File type validation
- Size limit enforcement
- Path traversal prevention
- Secure file storage

## Storage Location
All project files are stored in:
```
backend/uploads/projects/
```

File naming convention:
```
project-[timestamp]-[random-string].[extension]
```

## Error Handling

### Common Errors
1. **File too large**
   - Error: "File size exceeds 50MB limit"
   - Solution: Compress or reduce file size

2. **Invalid file type**
   - Error: "Please upload a valid file (zip, rar, pdf, doc, docx, ppt, pptx)"
   - Solution: Convert to supported format

3. **Already submitted**
   - Error: "Project already submitted for this application"
   - Solution: Contact recruiter for special cases

4. **Not authorized**
   - Error: "Not authorized to access this project"
   - Solution: Ensure you're logged in with correct account

## Best Practices

### For Students
- Upload complete, well-organized work
- Use descriptive file names
- Add clear description of what's included
- Test file before uploading
- Keep a local backup

### For Clients
- Download promptly after submission
- Store downloaded files securely
- Provide timely feedback
- Respect intellectual property

## Testing the Feature

### Test Scenario 1: Student Upload
1. Login as student
2. Apply for a job
3. Get application shortlisted (via admin/client)
4. Navigate to dashboard
5. Click "Submit Project"
6. Upload a test file
7. Verify success message

### Test Scenario 2: Client Download
1. Login as client
2. Navigate to job applications
3. Find application with submitted project
4. Verify project card appears
5. Click download button
6. Verify file downloads correctly

## Future Enhancements
- Multiple file uploads
- Version control for submissions
- In-browser preview
- Automatic virus scanning
- Cloud storage integration
- Email notifications on upload
- Submission deadlines
- Feedback/review system
