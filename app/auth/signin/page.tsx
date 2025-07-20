/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Key, LogIn } from "lucide-react";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="bg-white dark:bg-slate-900 dark:border-blue-800 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <div className="bg-white p-1 rounded">
                  <Key className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl text-slate-800 dark:text-slate-200">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-700 dark:text-slate-300">
              Sign in to join debates and share your opinions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers &&
              Object.values(providers).map((provider: any) => (
                <Button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  variant="outline"
                  className="w-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {provider.name === "Google" && <LogIn className="mr-2 h-4 w-4" />}
                  {provider.name === "GitHub" && <Github className="mr-2 h-4 w-4" />}
                  Sign in with {provider.name}
                </Button>
              ))}

            <div className="text-center pt-4">
              <Link 
                href="/" 
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}