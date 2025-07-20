"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { joinDebateSchema, type JoinDebateInput } from "@/lib/validations/debate"
import { zodResolver } from "@hookform/resolvers/zod"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface JoinDebateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debateId: string
  debateTitle: string
  onSuccess: () => void
}

export function JoinDebateDialog({ open, onOpenChange, debateId, debateTitle, onSuccess }: JoinDebateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JoinDebateInput>({
    resolver: zodResolver(joinDebateSchema),
  })

  const selectedSide = watch("side")

  const onSubmit = async (data: JoinDebateInput) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/debates/${debateId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        console.error("Error joining debate:", error)
      }
    } catch (error) {
      console.error("Error joining debate:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 dark:border-blue-800 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-blue-600 dark:text-blue-400">Join the Debate</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-300">
            Choose your stance on: <strong>{debateTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <RadioGroup
            value={selectedSide}
            onValueChange={(value) => setValue("side", value as "SUPPORT" | "OPPOSE")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer">
              <RadioGroupItem value="SUPPORT" id="support" />
              <Label htmlFor="support" className="flex items-center gap-2 cursor-pointer flex-1">
                <ThumbsUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Support</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">I agree with this topic</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border border-amber-300 dark:border-amber-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all cursor-pointer">
              <RadioGroupItem value="OPPOSE" id="oppose" />
              <Label htmlFor="oppose" className="flex items-center gap-2 cursor-pointer flex-1">
                <ThumbsDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Oppose</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">I disagree with this topic</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {errors.side && <p className="text-sm text-destructive">{errors.side.message}</p>}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !selectedSide}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? "Joining..." : "Join Debate"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
