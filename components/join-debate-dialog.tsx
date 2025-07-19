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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join the Debate</DialogTitle>
          <DialogDescription>
            Choose your stance on: <strong>{debateTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <RadioGroup value={selectedSide} onValueChange={(value) => setValue("side", value as "SUPPORT" | "OPPOSE")}>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="SUPPORT" id="support" />
              <Label htmlFor="support" className="flex items-center gap-2 cursor-pointer flex-1">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Support</div>
                  <div className="text-sm text-muted-foreground">I agree with this topic</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="OPPOSE" id="oppose" />
              <Label htmlFor="oppose" className="flex items-center gap-2 cursor-pointer flex-1">
                <ThumbsDown className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium">Oppose</div>
                  <div className="text-sm text-muted-foreground">I disagree with this topic</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {errors.side && <p className="text-sm text-destructive">{errors.side.message}</p>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting || !selectedSide} className="flex-1">
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