// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';
import QueryInterface from '@/components/QueryInterface';
import QueryHistory from '@/components/QueryHistory';
import api from '@/lib/api';
import { ScrollArea } from '@/components/ui/scroll-area';

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  // Auto-select the first file when files are loaded
  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      handleFileSelected(files[0].file_id);
    }
  }, [files]);

  const fetchFiles = async () => {
    try {
      const response = await api.getFiles();
      setFiles(response.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleFileSelected = (fileId) => {
    const file = files.find(f => f.file_id === fileId);
    setSelectedFile(file || null);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (

    <div className="p-0 md:p-5 h-screen md:h-auto w-full bg-[#f2f2f2]">
      <div className="w-full h-[calc(100vh-2.5rem)] md:rounded-xl md:border flex flex-col p-5 overflow-hidden bg-white">
        <div className="flex flex-col gap-4 md:rounded-t-xl px-3 md:px-0 ">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-3">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-gray-900">CSV RAG Application</span>
              <span className="text-sm text-muted-foreground">
                Upload, manage, and query your CSV files using natural language
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-10 h-[calc(100vh-150px)]">
          {/* Left Column - Upload and Query - Scrollable */}
          <div className="flex flex-col gap-6 md:w-2/3 h-full overflow-hidden mt-3">
            <ScrollArea className="h-full">
              <div className="pr-4 space-y-6">
                <FileUpload onFileUploaded={triggerRefresh} />
                <QueryInterface
                  selectedFile={selectedFile}
                  files={files}
                  onFileSelect={handleFileSelected}
                  onShowHistory={() => setShowHistory(true)}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Right Column - File List - Fixed */}
          <div className="md:w-1/3 h-full mt-3">
            <FileList
              onRefresh={triggerRefresh}
              triggerRefresh={refreshTrigger}
              className="h-full"
            />
          </div>
        </div>
        <QueryHistory
          show={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>
      <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

    </div>

  );
};

export default HomePage;