// src/global.d.ts
export {};

declare global {
  interface Window {
    electron: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
    electronAPI: {
      notify: (notification: { title: string; body: string}) => Promise<void>;
      onDeepLink(arg0: (url: string) => void): unknown;
      openFileDialog(): Promise<string[]>;
      readFile(path: string): Promise<Uint8Array>;
    };
  }
}
