const multer = require('multer');
const path = require('path');

// Storage for resumes
const resumeStorage = multer.diskStorage({
  destination: 'uploads/resumes/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// Storage for profile pictures
const profilePictureStorage = multer.diskStorage({
  destination: 'uploads/profile-pictures/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for project submissions
const projectStorage = multer.diskStorage({
  destination: 'uploads/projects/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter for projects (zip, rar, pdf, doc, docx, ppt, pptx)
const projectFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  const allowedExtensions = ['.zip', '.rar', '.pdf', '.doc', '.docx', '.ppt', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only zip, rar, pdf, doc, docx, ppt, pptx files are allowed!'), false);
  }
};

const uploadResume = multer({ storage: resumeStorage });
const uploadProfilePicture = multer({ 
  storage: profilePictureStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadProject = multer({ 
  storage: projectStorage,
  fileFilter: projectFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

module.exports = uploadResume;
module.exports.uploadProfilePicture = uploadProfilePicture;
module.exports.uploadProject = uploadProject;
