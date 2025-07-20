'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateArgumentInput, createArgumentSchema } from "@/lib/validations/debate"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, MessageSquare } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

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

  const onSubmitForm = async (data: CreateArgumentInput) => {
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
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-white dark:bg-slate-900 dark:border-blue-900/30 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <MessageSquare className="h-5 w-5" />
          Post Your Argument ({userSide === "SUPPORT" ? "Support" : "Oppose"})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-slate-700 dark:text-slate-300">
              Your Argument
            </Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts and reasoning..."
              rows={4}
              className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 focus-visible:ring-1 focus-visible:ring-blue-500 transition-all text-slate-800 dark:text-slate-200"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          {toxicError && (
            <Alert variant="destructive" className="bg-amber-300  shadow-sm ">
              <AlertTriangle className="h-4 w-4 text-slate-800 dark:text-red-500" />
              <AlertDescription className="text-sm text-slate-800 dark:text-red-500">
                {toxicError}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? "Posting..." : "Post Argument"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
