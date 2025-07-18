/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Github } from "lucide-react"
import Link from "next/link";



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
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to join debates and share your opinions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers &&
            Object.values(providers).map((provider: any) => (
              <Button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                variant="outline"
                className="w-full"
              >
                {provider.name === "GitHub" && <Github className="mr-2 h-4 w-4" />}
                Sign in with {provider.name}
              </Button>
            ))}

          <div className="text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )

}