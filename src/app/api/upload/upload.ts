import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import FileMeta from '../models/FileMeta';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), '/public/uploads'),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files: any) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'File parsing failed' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const storedName = path.basename(file.filepath);
    const metadata = await FileMeta.create({
      originalName: file.originalFilename,
      storedName,
      fileType: file.mimetype,
      filePath: `/uploads/${storedName}`,
    });

    return res.status(200).json({
      message: 'File uploaded successfully',
      filePath: metadata.filePath,
      fileId: metadata._id,
    });
  });
}
