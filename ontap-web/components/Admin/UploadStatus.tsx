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
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-300 rounded flex items-center gap-2">
        <FaCheckCircle />
        <span>Upload Complete!</span>
      </div>
    );
  }

  return null;
}
