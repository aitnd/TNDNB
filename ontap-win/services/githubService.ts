/**
 * GitHub Service - K\u1ebft n\u1ed1i v\u1edbi GitHub API \u0111\u1ec3 qu\u1ea3n l\u00fd Releases
 * S\u1eed d\u1ee5ng cho t\u00ednh n\u0103ng Auto-Update c\u1ee7a \u1ee9ng d\u1ee5ng Electron
 */

// C\u1ea5u h\u00ecnh m\u1eb7c \u0111\u1ecbnh
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
 * L\u1ea5y danh s\u00e1ch c\u00e1c releases
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
 * L\u1ea5y release m\u1edbi nh\u1ea5t
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
            return null; // Ch\u01b0a c\u00f3 release n\u00e0o
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
 * T\u1ea1o release m\u1edbi
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
 * Upload file asset l\u00ean release
 * L\u01b0u \u00fd: GitHub API y\u00eau c\u1ea7u URL upload \u0111\u1eb7c bi\u1ec7t
 */
export const uploadReleaseAsset = async (
    token: string,
    releaseId: number,
    file: File,
    onProgress?: (percent: number) => void
): Promise<GitHubAsset> => {
    // L\u1ea5y upload URL t\u1eeb release
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
    // upload_url c\u00f3 d\u1ea1ng: https://uploads.github.com/repos/owner/repo/releases/123/assets{?name,label}
    const uploadUrl = releaseData.upload_url.replace('{?name,label}', `?name=${encodeURIComponent(file.name)}`);

    // S\u1eed d\u1ee5ng XMLHttpRequest \u0111\u1ec3 theo d\u00f5i ti\u1ebfn tr\u00ecnh
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
 * X\u00f3a release
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
 * Ki\u1ec3m tra token c\u00f3 h\u1ee3p l\u1ec7 v\u00e0 c\u00f3 quy\u1ec1n repo kh\u00f4ng
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
        // Ki\u1ec3m tra xem c\u00f3 quy\u1ec1n push (write) kh\u00f4ng
        return data.permissions?.push === true;
    } catch {
        return false;
    }
};
