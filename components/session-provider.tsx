"use client";

import * as React from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvide({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}