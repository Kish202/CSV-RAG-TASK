// src/components/QueryHistory.jsx
import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Trash, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import historyStorage from '@/lib/storage';

const QueryHistory = ({ show, onClose }) => {
  const [history, setHistory] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (show) {
      refreshHistory();
    }
  }, [show]);

  const refreshHistory = () => {
    const historyItems = historyStorage.getHistory();
    setHistory(historyItems);
  };

  const handleClearHistory = () => {
    historyStorage.clearHistory();
    setHistory([]);
    setConfirmClear(false);
  };

  const handleDeleteItem = (timestamp) => {
    historyStorage.deleteHistoryItem(timestamp);
    refreshHistory();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Query History</CardTitle>
            <CardDescription>
              Your past queries and responses
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <div className="overflow-auto scrollbar-hide">
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No query history yet. Start asking questions about your CSV files!
              </div>
            ) : (
              <Accordion type="multiple" className="w-full space-y-2">
                {history.map((item) => (
                  <AccordionItem
                    key={item.timestamp}
                    value={item.timestamp}
                    className="border rounded-md w-full"
                  >
                    <div className="flex items-center justify-between px-4 w-full">
                      <AccordionTrigger className="hover:no-underline py-2 flex-1">
                        <div className="flex flex-col items-start text-left w-full">
                          <div className="font-medium">{item.query}</div>
                          <div className="text-xs text-muted-foreground flex gap-2 mt-1 items-center">
                            <span>{formatDate(item.timestamp)}</span>
                            <Badge variant="outline" size="sm">
                              {item.fileName}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.timestamp);
                        }}
                        className="h-8 w-8 p-0 flex-shrink-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <AccordionContent className="px-4 pb-3 w-full">
                      <div className="p-3 bg-muted rounded-md whitespace-pre-wrap mt-2 text-sm">
                        {item.response}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </div>

        <CardFooter className="border-t p-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            {history.length} saved {history.length === 1 ? 'query' : 'queries'}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmClear(true)}
            disabled={history.length === 0}
          >
            Clear History
          </Button>
        </CardFooter>
      </Card>

      {/* Confirm Clear Dialog */}
      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all history?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your query history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleClearHistory}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QueryHistory;