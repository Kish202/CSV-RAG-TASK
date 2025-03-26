// src/components/FileList.jsx
import { useState, useEffect } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import api from '@/lib/api';

const FileList = ({ onRefresh, triggerRefresh, className = "" }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [triggerRefresh]);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getFiles();
      setFiles(response.files || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch files');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await api.deleteFile(fileId);
      // Remove the file from the list
      setFiles(files.filter(file => file.file_id !== fileId));
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err.message || 'Failed to delete file');
    } finally {
      setFileToDelete(null);
    }
  };

  return (
    <Card className={`w-full h-full flex flex-col ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Your CSV Files</CardTitle>
          <CardDescription>Manage your uploaded CSV files</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchFiles} 
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-300px)]">
          {loading ? (
            <div className="flex justify-center my-4">Loading files...</div>
          ) : error ? (
            <div className="text-red-500 my-4">{error}</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No CSV files uploaded yet. Upload a file to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.file_id}>
                    <TableCell className="font-medium">{file.file_name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs truncate max-w-[100px]">
                      {file.file_id}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => setFileToDelete(file)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!fileToDelete} onOpenChange={open => !open && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the file "{fileToDelete?.file_name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600" 
              onClick={() => handleDeleteFile(fileToDelete?.file_id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default FileList;