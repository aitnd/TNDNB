import React, { useCallback, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

import Swal from 'sweetalert2';
import { getGitHubConfig, saveUsageConfig } from '../../services/adminConfigService';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const ALLOWED_EXTENSIONS = ['.exe', '.yml', '.blockmap'];

export const publishReleaseToGitHub = async (
    releaseVersion: string,
    releaseNotes: string,
    selectedFiles: File[],
    config: any,
    setGithubUploadProgress: (progress: any) => void
) => {
    if (!releaseVersion) {
        Swal.fire('Lỗi', 'Vui lòng nhập phiên bản', 'error');
        return false;
    }
    if (selectedFiles.length !== 3) {
        Swal.fire('Lỗi', 'Bắt buộc phải chọn đúng 3 file: .exe, .yml, .blockmap.', 'error');
        return false;
    }

    const hasExe = selectedFiles.some(f => f.name.endsWith('.exe'));
    const hasYml = selectedFiles.some(f => f.name.endsWith('.yml'));
    const hasBlockmap = selectedFiles.some(f => f.name.endsWith('.blockmap'));
    
    if (!hasExe || !hasYml || !hasBlockmap) {
        Swal.fire('Lỗi', 'Thiếu file. Yêu cầu chọn đủ .exe, .yml và .blockmap.', 'error');
        return false;
    }

    const tokenConfig = await getGitHubConfig();
    if (!tokenConfig || !tokenConfig.token) {
        Swal.fire('Lỗi', 'Chưa cấu hình GitHub Token trong hệ thống.', 'error');
        return false;
    }
    const token = tokenConfig.token;
    
    try {
        const { validateToken, getReleaseByTag, deleteRelease, deleteTag, createRelease, uploadReleaseAsset } = await import('../../services/githubService');
        const isValid = await validateToken(token);
        if (!isValid) throw new Error('GitHub Token không hợp lệ hoặc không có quyền push (write).');

        const tag = `v${releaseVersion.replace(/^v/, '')}`;
        
        const existingRelease = await getReleaseByTag(token, tag);
        if (existingRelease) {
            await deleteRelease(token, existingRelease.id);
            await deleteTag(token, tag);
        }

        const release = await createRelease(token, {
            tag_name: tag,
            name: `TND Version ${tag}`,
            body: releaseNotes || 'Bản cập nhật mới.',
            draft: false,
            prerelease: false
        });

        let exeUrl = '';
        
        // Sắp xếp ưu tiên: .exe upload trước, rồi đến .yml, .blockmap
        const sortedFiles = [...selectedFiles].sort((a, b) => {
            const extA = a.name.match(/\.[0-9a-z]+$/i)?.[0] || '';
            const extB = b.name.match(/\.[0-9a-z]+$/i)?.[0] || '';
            const order: Record<string, number> = { '.exe': 1, '.yml': 2, '.blockmap': 3 };
            return (order[extA] || 99) - (order[extB] || 99);
        });

        for (const file of sortedFiles) {
            const asset = await uploadReleaseAsset(token, release.id, file, (percent) => {
                setGithubUploadProgress((prev: any) => ({ ...prev, [file.name]: percent }));
            });
            
            if (file.name.endsWith('.exe')) {
                exeUrl = asset.browser_download_url || `https://github.com/aitnd/TNDNB/releases/download/${tag}/${file.name}`;
            }
        }
        
        if (config && exeUrl) {
            const updatedConfig = {
                ...config,
                app_links: {
                    ...config.app_links,
                    version: releaseVersion.replace(/^v/, ''),
                    windows: exeUrl
                }
            };
            await saveUsageConfig(updatedConfig);
            Swal.fire('Thành công', 'Đã phát hành phiên bản mới lên GitHub!', 'success');
            return updatedConfig;
        }

        throw new Error('Không thể lấy URL tải xuống của file .exe.');
    } catch (err: any) {
        try {
            const { getReleaseByTag, deleteRelease, deleteTag } = await import('../../services/githubService');
            const tag = `v${releaseVersion.replace(/^v/, '')}`;
            const r = await getReleaseByTag(token, tag);
            if (r) {
                await deleteRelease(token, r.id);
                await deleteTag(token, tag);
            }
        } catch (e) {}
        Swal.fire('Lỗi', 'Đã xảy ra lỗi khi upload lên GitHub: ' + err.message, 'error');
        return false;
    }
};

export default function UploadZone({ onFilesSelected, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateFiles = (files: File[]) => {
    const invalidFiles = files.filter(f => !ALLOWED_EXTENSIONS.some(ext => f.name.endsWith(ext)));
    if (invalidFiles.length > 0) {
      setError(`Invalid file type. Only ${ALLOWED_EXTENSIONS.join(', ')} are allowed.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      if (validateFiles(filesArray)) {
        onFilesSelected(filesArray);
      }
    }
  }, [onFilesSelected, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      if (validateFiles(filesArray)) {
        onFilesSelected(filesArray);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
          accept=".exe,.yml,.blockmap"
        />
        <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Drag and drop files here (.exe, .yml, .blockmap)
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          or click to select files
        </p>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
