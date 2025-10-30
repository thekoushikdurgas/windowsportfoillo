const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  
  // File operations
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  
  // Event listeners
  onFileOpened: (callback) => ipcRenderer.on('file-opened', callback),
  onSaveRequested: (callback) => ipcRenderer.on('save-requested', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  isElectron: true,
  
  // Native features
  openExternal: (url) => {
    // This would need to be implemented in main process
    console.log('Opening external URL:', url);
  },
  
  // System info
  getSystemInfo: () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.versions.electron,
      node: process.versions.node,
      chrome: process.versions.chrome
    };
  }
});

// Expose a limited set of Node.js APIs
contextBridge.exposeInMainWorld('nodeAPI', {
  path: {
    join: (...args) => require('path').join(...args),
    dirname: (path) => require('path').dirname(path),
    basename: (path) => require('path').basename(path),
    extname: (path) => require('path').extname(path),
    resolve: (...args) => require('path').resolve(...args)
  },
  os: {
    homedir: () => require('os').homedir(),
    tmpdir: () => require('os').tmpdir(),
    platform: () => require('os').platform(),
    arch: () => require('os').arch()
  }
});
