"use client";

/**
 * ClientProviders - wraps the app with client-side context providers
 */

import { ReactNode } from "react";
import { SoundProvider } from "@/contexts/SoundContext";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <SoundProvider>{children}</SoundProvider>;
}
