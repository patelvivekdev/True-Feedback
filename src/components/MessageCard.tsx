'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { deleteMessage } from '@/actions/message';

interface Message {
  id: string;
  content: string | null;
  createdAt: string;
}

export function MessageCard({ message }: { message: Message }) {
  const handleDeleteConfirm = async () => {
    const response = await deleteMessage(message.id);
    if (response.type === 'error') {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  const createdAt = new Date(message.createdAt).toDateString();

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">{createdAt}</div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
