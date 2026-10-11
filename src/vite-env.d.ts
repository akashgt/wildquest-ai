/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMMA_ENDPOINT?: string;
  readonly VITE_GEMMA_MODEL?: string;
  readonly VITE_GEMMA_TIMEOUT_MS?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ENVIRONMENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
