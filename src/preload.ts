import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  notify: (data: any) => ipcRenderer.invoke('notify', data),
  onDeepLink: (callback: (url: string) => void) =>
    ipcRenderer.on('deep-link', (_, url) => callback(url)),
});
