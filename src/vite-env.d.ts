/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACCESS_TOKEN: string
  readonly VITE_CLIENT: string
  readonly VITE_TOKEN: string
  readonly VITE_UID: string
  readonly VITE_UUID: string
  readonly VITE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}