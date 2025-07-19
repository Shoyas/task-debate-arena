'use client';

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateArgumentInput, createArgumentSchema } from "@/lib/validations/debate";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ArgumentFormProps {
  debateId: string
  userSide: "SUPPORT" | "OPPOSE"
  onSubmit: () => void
}


export function ArgumentForm({ debateId, userSide, onSubmit }: ArgumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toxicError, setToxicError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateArgumentInput>({
    resolver: zodResolver(createArgumentSchema),
    defaultValues: {
      side: userSide,
    },
  })

  const onSubmitForm = async(data: CreateArgumentInput) => {
    setIsSubmitting(true)
    setToxicError(null)

    try {
      const response = await fetch(`/api/debates/${debateId}/arguments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        reset()
        onSubmit()
      } else {
        const error = await response.json()
        if (error.toxicWords) {
          setToxicError(`Your argument contains inappropriate language: ${error.toxicWords.join(", ")}`)
        } else {
          console.error("Error creating argument:", error)
        }
      }
    } catch (error) {
      console.error("Error creating argument:", error)
    } finally{
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Post Your Argument ({userSide === "SUPPORT" ? "Support" : "Oppose"})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Your Argument</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts and reasoning..."
              rows={4}
              {...register("content")}
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
          </div>

          {toxicError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{toxicError}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Argument"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}