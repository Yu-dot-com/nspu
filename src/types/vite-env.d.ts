/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};

declare global {
  interface Window {
    electronAPI: {
      openFileDialog: () => Promise<string[]>;
      readFile: (filePath: string) => Promise<Uint8Array>;
      notify: (data: any) => Promise<boolean>;
      onDeepLink: (callback: (url: string) => void) => void;
    };
  }
}
