'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Folder, FileText, AlertCircle } from 'lucide-react';

interface FileOperationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  type: 'file' | 'folder';
  operation: 'create' | 'rename';
  currentName?: string;
  error?: string | null;
}

export function FileOperationDialog({
  isOpen,
  onClose,
  onConfirm,
  type,
  operation,
  currentName = '',
  error,
}: FileOperationDialogProps) {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setNameError('');
    }
  }, [isOpen, currentName]);

  const validateName = (value: string) => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.includes('/') || value.includes('\\') || value.includes(':')) {
      return 'Name contains invalid characters';
    }
    if (value.length > 255) {
      return 'Name is too long';
    }
    return '';
  };

  const handleNameChange = (value: string) => {
    setName(value);
    const error = validateName(value);
    setNameError(error);
  };

  const handleConfirm = () => {
    const error = validateName(name);
    if (error) {
      setNameError(error);
      return;
    }
    onConfirm(name.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !nameError) {
      handleConfirm();
    }
  };

  const getTitle = () => {
    if (operation === 'create') {
      return type === 'folder' ? 'New Folder' : 'New File';
    }
    return 'Rename';
  };

  const getPlaceholder = () => {
    if (operation === 'create') {
      return type === 'folder' ? 'Folder name' : 'File name';
    }
    return 'New name';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'folder' ? (
              <Folder className="w-5 h-5 text-blue-500" />
            ) : (
              <FileText className="w-5 h-5 text-gray-500" />
            )}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              className={nameError ? 'border-red-500' : ''}
              autoFocus
            />
            {nameError && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {nameError}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!!nameError || !name.trim()}
          >
            {operation === 'create' ? 'Create' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
