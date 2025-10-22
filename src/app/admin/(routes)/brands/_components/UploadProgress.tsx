"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import React from "react";
import { IUploadProgressInfo } from "../_types/brand.types";

interface UploadProgressProps {
  uploads: Record<string, IUploadProgressInfo>;
  onCancel?: (fileId: string) => void;
  onCancelAll?: () => void;
  className?: string;
}

export function UploadProgress({
  uploads,
  onCancel,
  onCancelAll,
  className = ""
}: UploadProgressProps) {
  const uploadEntries = Object.entries(uploads);
  
  if (uploadEntries.length === 0) {
    return null;
  }

  const getStatusIcon = (status: IUploadProgressInfo['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-500" />;
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: IUploadProgressInfo['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'uploading':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: IUploadProgressInfo['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'uploading':
        return 'Uploading';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const totalProgress = uploadEntries.reduce((sum, [, upload]) => sum + upload.progress, 0);
  const averageProgress = totalProgress / uploadEntries.length;
  const completedCount = uploadEntries.filter(([, upload]) => upload.status === 'completed').length;
  const failedCount = uploadEntries.filter(([, upload]) => upload.status === 'failed').length;
  const activeCount = uploadEntries.filter(([, upload]) => 
    upload.status === 'uploading' || upload.status === 'processing'
  ).length;

  return (
    <Card className={cn("border-l-4 border-l-blue-500", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Upload Progress ({completedCount}/{uploadEntries.length})
          </CardTitle>
          {onCancelAll && activeCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelAll}
              className="h-8 px-3"
            >
              Cancel All
            </Button>
          )}
        </div>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Overall Progress</span>
            <span>{Math.round(averageProgress)}%</span>
          </div>
          <Progress value={averageProgress} className="h-2" />
          
          {/* Summary Stats */}
          <div className="flex gap-2 text-xs">
            {activeCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {activeCount} active
              </Badge>
            )}
            {completedCount > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {completedCount} completed
              </Badge>
            )}
            {failedCount > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {failedCount} failed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {uploadEntries.map(([fileId, upload]) => (
            <div key={fileId} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {getStatusIcon(upload.status)}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">
                    {upload.file.name}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", getStatusColor(upload.status))}
                  >
                    {getStatusText(upload.status)}
                  </Badge>
                </div>
                
                {/* Progress Bar */}
                {upload.status !== 'failed' && (
                  <div className="space-y-1">
                    <Progress 
                      value={upload.progress} 
                      className="h-1.5" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round(upload.progress)}%</span>
                      <span>{(upload.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {upload.error && (
                  <p className="text-xs text-red-600 mt-1">
                    {upload.error}
                  </p>
                )}
              </div>

              {/* Cancel Button */}
              {onCancel && (upload.status === 'pending' || upload.status === 'uploading') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancel(fileId)}
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}