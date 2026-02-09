// TODO: Install multer: npm install multer
// TODO: Install types: npm install --save-dev @types/multer
// import multer from 'multer';

// ⚠️ MEMORY STORAGE - Images are NOT saved to disk or database
// Images exist only in RAM during processing, then are garbage collected
// const storage = multer.memoryStorage();

// Configure multer with limits and file filtering
// export const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB max file size
//   },
//   fileFilter: (req: any, file: any, cb: any) => {
//     // Only accept image files
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'));
//     }
//   },
// });

// Single file upload middleware
// export const uploadSingle = upload.single('image');

// Placeholder until multer is installed
export const uploadSingle = (req: any, res: any, next: any) => {
  // TODO: Replace with actual multer middleware
  next();
};
