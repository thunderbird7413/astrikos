import mongoose from 'mongoose';

const FileMetaSchema = new mongoose.Schema({
  originalName: String,
  storedName: String,
  fileType: String,
  filePath: String,
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
});

export default mongoose.models.FileMeta || mongoose.model('FileMeta', FileMetaSchema);
