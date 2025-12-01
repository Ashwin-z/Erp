import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

/**
 * Base Storage Adapter Class
 */
class StorageAdapter {
    constructor(config) {
        this.config = config || {};
        this.isConnected = !!config.accessToken;
    }

    async connect() { throw new Error("Not implemented"); }
    async listFolders(path = '/') { throw new Error("Not implemented"); }
    async uploadFile(file, path) { throw new Error("Not implemented"); }
}

/**
 * Google Drive Adapter (Simulated)
 */
class GoogleDriveAdapter extends StorageAdapter {
    async connect() {
        // Simulate OAuth Popup
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    accessToken: "ya29.simulated_token_" + Math.random().toString(36).substr(2),
                    refreshToken: "refresh_token_" + Math.random().toString(36).substr(2),
                    email: "user@gmail.com",
                    provider: "Google Drive"
                });
            }, 1500);
        });
    }

    async listFolders(path = 'root') {
        // Simulate listing folders
        return [
            { id: '1', name: 'Invoices', type: 'folder' },
            { id: '2', name: 'Contracts', type: 'folder' },
            { id: '3', name: 'Receipts', type: 'folder' },
            { id: '4', name: 'Project X', type: 'folder' }
        ];
    }

    async uploadFile(fileObj, path) {
        // Simulate upload
        await new Promise(r => setTimeout(r, 2000));
        return {
            id: 'file_' + Math.random().toString(36).substr(2),
            url: `https://drive.google.com/file/d/simulated_id/view`,
            path: path + '/' + fileObj.name
        };
    }
}

/**
 * Dropbox Adapter (Simulated)
 */
class DropboxAdapter extends StorageAdapter {
    async connect() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    accessToken: "sl.simulated_dropbox_token",
                    email: "user@dropbox.com",
                    provider: "Dropbox"
                });
            }, 1500);
        });
    }

    async listFolders(path = '') {
        return [
            { id: 'db1', name: 'Work', type: 'folder' },
            { id: 'db2', name: 'Personal', type: 'folder' },
            { id: 'db3', name: 'Scans', type: 'folder' }
        ];
    }

    async uploadFile(fileObj, path) {
        await new Promise(r => setTimeout(r, 1500));
        return {
            id: 'id:' + Math.random().toString(36).substr(2),
            url: `https://www.dropbox.com/s/simulated/file?dl=0`,
            path: path + '/' + fileObj.name
        };
    }
}

/**
 * OneDrive Adapter (Simulated)
 */
class OneDriveAdapter extends StorageAdapter {
    async connect() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    accessToken: "EwBA...simulated_ms_token",
                    email: "user@outlook.com",
                    provider: "OneDrive"
                });
            }, 1500);
        });
    }

    async listFolders(path = '/') {
        return [
            { id: 'od1', name: 'Documents', type: 'folder' },
            { id: 'od2', name: 'Pictures', type: 'folder' }
        ];
    }

    async uploadFile(fileObj, path) {
        await new Promise(r => setTimeout(r, 1800));
        return {
            id: 'od_file_' + Math.random().toString(36).substr(2),
            url: `https://1drv.ms/u/s!simulated`,
            path: path + '/' + fileObj.name
        };
    }
}

/**
 * Local / S3 Adapter (Default Base44)
 */
class LocalAdapter extends StorageAdapter {
    async connect() {
        return { provider: "Local", connected: true };
    }

    async listFolders(path = '/') {
        return [
            { id: 'l1', name: 'Uploads', type: 'folder' },
            { id: 'l2', name: 'Generated', type: 'folder' }
        ];
    }

    async uploadFile(fileObj, path) {
        // Local upload is handled by base44.integrations.Core.UploadFile usually
        // We assume it's already uploaded to temp, we just return the url
        return {
            url: fileObj.url, 
            path: path + '/' + fileObj.name
        };
    }
}

export const StorageFactory = {
    getAdapter(provider, config = {}) {
        switch(provider) {
            case 'Google Drive': return new GoogleDriveAdapter(config);
            case 'Dropbox': return new DropboxAdapter(config);
            case 'OneDrive': return new OneDriveAdapter(config);
            case 'Local': 
            default: return new LocalAdapter(config);
        }
    }
};