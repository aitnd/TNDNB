import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface UploadStatusProps {
  error: string | null;
  success: boolean;
  onRetry?: () => void;
}

export default function UploadStatus({ error, success, onRetry }: UploadStatusProps) {
  if (error) {
    return (
      <div className="mt-4 p-4 bg-destructive/10 border border-destructive text-destructive rounded flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors text-sm"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-4 p-4 bg-success/10 border border-success/30 text-success rounded flex items-center gap-2">
        <FaCheckCircle />
        <span>Upload Complete!</span>
      </div>
    );
  }

  return null;
}
