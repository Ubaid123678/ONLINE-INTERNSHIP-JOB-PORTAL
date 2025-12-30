# Project Submission Feature - Testing & Verification Guide

## ✅ All Changes Implemented

### Backend Changes
1. ✅ Created `/uploads/projects/` directory
2. ✅ Added `uploadProject` middleware in `middleware/upload.js`
3. ✅ Updated `routes/applications.js` to use `uploadProject` middleware
4. ✅ Project submission and download routes are active

### Frontend Changes
1. ✅ `ProjectSubmissionModal` component created
2. ✅ `ProjectSubmissionCard` component created
3. ✅ `StudentDashboard` updated with upload functionality
4. ✅ `JobApplicationsPage` updated with download functionality
5. ✅ All props correctly matched

## 🧪 Testing Steps

### Step 1: Verify Student Can See Upload Button

**Prerequisites:**
- Have a student account logged in
- Have at least one job application with status = "shortlisted"

**Steps:**
1. Log in as a student
2. Navigate to Student Dashboard
3. Look for applications with "Shortlisted" badge (green)
4. You should see a **green "Submit Project" button** below the "View Job" and "Chat" buttons

**Expected Result:**
```
┌─────────────────────────────────────────┐
│ Job Title: Full Stack Developer        │
│ Status: [Shortlisted Badge]            │
│ ┌──────────┐ ┌──────┐                 │
│ │ View Job │ │ Chat │                 │
│ └──────────┘ └──────┘                 │
│ ┌────────────────────────────────────┐ │
│ │  📤 Submit Project                 │ │ <- This button should appear
│ └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Step 2: Test Project Upload

**Steps:**
1. Click "Submit Project" button
2. A modal should open with title "Submit Completed Project"
3. See warning: "You can only submit your project once"
4. Click "Choose File" button
5. Select a test file (create a test.zip or test.pdf)
6. Optionally add a description
7. Click "Submit Project" button
8. Watch the upload progress bar
9. Upload should complete and modal should close

**Expected Result:**
- Upload progress bar shows from 0% to 100%
- Success message appears
- Modal closes automatically
- Dashboard refreshes
- Submitted project card appears

### Step 3: Verify Submission Card (Student View)

**After upload, you should see:**
```
┌─────────────────────────────────────────────────┐
│ ✅ Project Submitted                           │
│                                                 │
│ 📁 test.zip                                    │
│    2.5 MB • Submitted December 16, 2025        │
│    [Download Button]                           │
│                                                 │
│ Description:                                    │
│ "This is my completed project..."              │
│                                                 │
│ ℹ️ Your project has been submitted            │
│    successfully. The client can now review     │
│    and download your work.                     │
└─────────────────────────────────────────────────┘
```

### Step 4: Verify Client Can See and Download

**Prerequisites:**
- Have a client/recruiter account
- Have a job with applications
- Student must have submitted a project

**Steps:**
1. Log in as client/recruiter
2. Go to "My Jobs"
3. Click on a job that has applications
4. Click "View Applications"
5. Find the application where student submitted a project
6. You should see the **Project Submission Card**

**Expected Result:**
```
┌─────────────────────────────────────────────────┐
│ ✅ Project Submitted                           │
│                                                 │
│ 📁 test.zip                                    │
│    2.5 MB • Submitted December 16, 2025        │
│    [📥 Download Button]                        │
│                                                 │
│ Description:                                    │
│ "This is my completed project..."              │
│                                                 │
│ ✅ The student has completed and submitted    │
│    their project. You can download and         │
│    review the work above.                      │
└─────────────────────────────────────────────────┘
```

### Step 5: Test Download Functionality

**Steps:**
1. As client, click the "Download" button
2. File should download to your computer
3. Verify the file is correct and not corrupted

### Step 6: Test One-Time Submission Restriction

**Steps:**
1. As student, try to submit another project for the same application
2. The "Submit Project" button should NOT appear anymore
3. Only the submission card should be visible

## 🔍 Troubleshooting

### Issue 1: "Submit Project" Button Not Showing

**Possible Causes:**
- Application status is not "shortlisted"
- Project already submitted
- Frontend not updated

**Solutions:**
1. Check application status in database or admin panel
2. Ensure status is exactly "shortlisted" (lowercase)
3. Refresh the page (Ctrl + F5)
4. Check browser console for errors

**SQL/MongoDB Query to Check:**
```javascript
// In MongoDB
db.applications.find({ student: ObjectId("YOUR_STUDENT_ID") })

// Should show: { status: "shortlisted", projectSubmission: { isSubmitted: false } }
```

### Issue 2: Upload Fails

**Possible Causes:**
- File too large (> 50MB)
- Invalid file type
- Backend not running
- Network error

**Solutions:**
1. Check file size: must be < 50MB
2. Use allowed formats: .zip, .rar, .pdf, .doc, .docx, .ppt, .pptx
3. Check backend console for errors
4. Check browser Network tab (F12)

### Issue 3: Client Can't See Submitted Project

**Possible Causes:**
- Application not properly populated
- Frontend not refreshed
- Database not updated

**Solutions:**
1. Refresh the applications page
2. Check backend logs for errors
3. Verify in database that projectSubmission.isSubmitted = true

### Issue 4: Download Fails

**Possible Causes:**
- File path incorrect
- File deleted from server
- Permission issue

**Solutions:**
1. Check if file exists in `backend/uploads/projects/`
2. Verify file path in database
3. Check backend console for download errors

## 📊 Database Verification

### Check Application Document
```javascript
// Expected structure
{
  _id: ObjectId("..."),
  student: ObjectId("..."),
  job: ObjectId("..."),
  status: "completed", // Changed from "shortlisted" after submission
  projectSubmission: {
    file: "uploads/projects/project-1734394800000-12345.zip",
    fileName: "test.zip",
    fileSize: 2621440,  // in bytes
    description: "My completed project",
    submittedAt: ISODate("2025-12-16T18:00:00Z"),
    isSubmitted: true
  }
}
```

## 🎯 Quick Test Checklist

- [ ] Student Dashboard shows "Submit Project" button for shortlisted applications
- [ ] Upload modal opens when button is clicked
- [ ] File can be selected and validated
- [ ] Upload progress bar works
- [ ] Upload completes successfully
- [ ] Submission card appears for student
- [ ] Client can see submission card in their applications
- [ ] Client can download the file
- [ ] Downloaded file is not corrupted
- [ ] Student cannot submit twice (button disappears)
- [ ] File is stored in `backend/uploads/projects/`

## 🚀 System Status

**Backend Server:**
- Status: ✅ Running on port 5000
- Uploads Directory: ✅ Created at `backend/uploads/projects/`
- Routes: ✅ Active
  - POST `/api/applications/:id/submit-project`
  - GET `/api/applications/:id/download-project`

**Frontend Server:**
- Status: ✅ Running on port 3000
- Components: ✅ All created and integrated
- No compilation errors

**Database:**
- Collections Updated: ✅ applications
- New Fields: ✅ projectSubmission schema

## 📝 API Testing with Postman/curl

### Test Upload (Student)
```bash
curl -X POST http://localhost:5000/api/applications/APPLICATION_ID/submit-project \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -F "projectFile=@/path/to/test.zip" \
  -F "description=My completed project"
```

### Test Download (Client)
```bash
curl -X GET http://localhost:5000/api/applications/APPLICATION_ID/download-project \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN" \
  --output downloaded-project.zip
```

## 🎨 Visual Indicators

### Student Dashboard
- Green "Submit Project" button appears for shortlisted applications
- Upload icon (cloud-upload) on button
- Project submission card with checkmark icon

### Client Applications Page
- Project submission card appears below application details
- Download button with download icon
- File details clearly displayed

## ⚡ Performance Notes

- Maximum file size: 50MB
- Supported formats: 7 types (.zip, .rar, .pdf, .doc, .docx, .ppt, .pptx)
- Upload progress tracking: Real-time
- File storage: Local disk (`uploads/projects/`)

## 🔐 Security

- ✅ Authentication required for all operations
- ✅ Students can only upload to their own applications
- ✅ Clients can only download from their own jobs
- ✅ File type validation (both frontend and backend)
- ✅ File size limits enforced
- ✅ One-time submission per application

---

**Last Updated:** December 16, 2025
**System Status:** ✅ All Features Active and Ready for Testing
