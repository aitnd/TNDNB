/**
 * GitHub Service - Kết nối với GitHub API để quản lý Releases
 * Sử dụng cho tính năng Auto-Update của ứng dụng Electron
 */

// Cấu hình mặc định
const GITHUB_OWNER = 'aitnd';
const GITHUB_REPO = 'TNDNB';
const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubRelease {
    id: number;
    tag_name: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    html_url: string;
    assets: GitHubAsset[];
}

export interface GitHubAsset {
    id: number;
    name: string;
    size: number;
    download_count: number;
    browser_download_url: string;
}

export interface CreateReleaseParams {
    tag_name: string;
    name: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
}

/**
 * Lấy danh sách các releases
 */
export const getReleases = async (token: string): Promise<GitHubRelease[]> => {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch releases');
    }

    return response.json();
};

/**
 * Lấy release mới nhất
 */
export const getLatestRelease = async (token: string): Promise<GitHubRelease | null> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (response.status === 404) {
            return null; // Chưa có release nào
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch latest release');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching latest release:', error);
        return null;
    }
};

/**
 * Tạo release mới
 */
export const createRelease = async (token: string, params: CreateReleaseParams): Promise<GitHubRelease> => {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28'
        },
        body: JSON.stringify({
            tag_name: params.tag_name,
            name: params.name,
            body: params.body || '',
            draft: params.draft ?? false,
            prerelease: params.prerelease ?? false
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create release');
    }

    return response.json();
};

/**
 * Upload file asset lên release
 */
export const uploadReleaseAsset = async (
    token: string,
    releaseId: number,
    file: File,
    onProgress?: (percent: number) => void
): Promise<GitHubAsset> => {
    const releaseResponse = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/${releaseId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (!releaseResponse.ok) {
        throw new Error('Failed to get release info');
    }

    const releaseData = await releaseResponse.json();
    const uploadUrl = releaseData.upload_url.replace('{?name,label}', `?name=${encodeURIComponent(file.name)}`);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                try {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.message || 'Upload failed'));
                } catch {
                    reject(new Error('Upload failed'));
                }
            }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));

        xhr.open('POST', uploadUrl);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Accept', 'application/vnd.github+json');
        xhr.send(file);
    });
};

/**
 * Xóa release
 */
export const deleteRelease = async (token: string, releaseId: number): Promise<void> => {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/${releaseId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (!response.ok && response.status !== 204) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete release');
    }
};

/**
 * Kiểm tra token có hợp lệ và có quyền repo không
 */
export const validateToken = async (token: string): Promise<boolean> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.permissions?.push === true;
    } catch {
        return false;
    }
};
