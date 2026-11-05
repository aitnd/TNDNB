import React from 'react';
import { FaFilePdf, FaFileWord, FaFileArchive, FaFile } from 'react-icons/fa';
import styles from './tao-moi/page.module.css';

export type Category = {
  id: string;
  name: string;
};

export type Attachment = {
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string, iconClassName?: string): React.JSX.Element => {
  const cls = iconClassName || styles.attachmentIcon;
  if (fileType.includes('pdf')) return <FaFilePdf className={cls} />;
  if (fileType.includes('word') || fileType.includes('doc')) return <FaFileWord className={cls} />;
  if (fileType.includes('zip') || fileType.includes('rar')) return <FaFileArchive className={cls} />;
  return <FaFile className={cls} />;
};

export const sanitizeFileName = (fileName: string): string => {
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  let baseName = fileName.substring(0, fileName.lastIndexOf('.'));
  baseName = baseName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/__+/g, '_')
    .replace(/--+/g, '-');
  return `${baseName}${extension}`;
};
