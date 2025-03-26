// src/components/QueryInterface.jsx
import { useState, useEffect } from 'react';
import { Send, History, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import historyStorage from '@/lib/storage';

const QueryInterface = ({ selectedFile, files, onFileSelect, onShowHistory }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset response when a new file is selected
  useEffect(() => {
    setResponse('');
    setError(null);
  }, [selectedFile]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmitQuery = async () => {
    if (!selectedFile) {
      setError('Please select a file to query');
      return;
    }

    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.queryFile(selectedFile.file_id, query);
      setResponse(result.response);
      
      // Save to history
      historyStorage.addToHistory({
        fileId: selectedFile.file_id,
        fileName: selectedFile.file_name,
        query: query,
        response: result.response,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'Failed to query file');
    } finally {
      setLoading(false);
    }
  };

  const handleClearResponse = () => {
    setResponse('');
  };

  const handleKeyDown = (e) => {
    // Submit on Enter + Ctrl/Cmd
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitQuery();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Query CSV Data</CardTitle>
            <CardDescription>
              Ask questions about your CSV data
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select 
              value={selectedFile?.file_id || ""} 
              onValueChange={onFileSelect}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a file" />
              </SelectTrigger>
              <SelectContent>
                {files.map(file => (
                  <SelectItem key={file.file_id} value={file.file_id}>
                    {file.file_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={onShowHistory}>
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-auto">
        <div className="flex flex-col gap-2 py-2">
          <Textarea 
            placeholder={selectedFile 
              ? "Ask a question about this CSV file... (Ctrl+Enter to submit)" 
              : "Select a file first, then ask a question..."
            }
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            disabled={loading || !selectedFile}
            className="min-h-[120px] resize-none"
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitQuery} 
              disabled={loading || !selectedFile || !query.trim()}
            >
              {loading ? 'Processing...' : 'Submit Query'}
              {!loading && <Send className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {response && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Response</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearResponse}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryInterface;