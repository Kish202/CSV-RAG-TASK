// src/components/FileUpload.jsx
import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';

const FileUpload = ({ onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Only CSV files are allowed');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await api.uploadFile(file);
      setSuccess(`File uploaded successfully! File ID: ${result.file_id}`);
      setFile(null);
      if (onFileUploaded) {
        onFileUploaded();
      }
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload CSV</CardTitle>
        <CardDescription>
          Upload a CSV file for analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Button onClick={handleUpload} disabled={uploading || !file}>
              {uploading ? 'Uploading...' : 'Upload'}
              {!uploading && <UploadCloud className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          {file && (
            <div className="text-sm text-gray-500">
              Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mt-4 bg-green-50 border-green-300 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;