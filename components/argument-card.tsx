'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { canEditArgument } from "@/lib/utils/time";
import { formatDistanceToNow } from "date-fns";
import { Clock, Edit, Heart, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useState } from "react";


interface Argument{
  id: string
  content: string
  side: "SUPPORT" | "OPPOSE"
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    image?: string
  }
  _count: {
    votes: number
  }
}

interface ArgumentCardProps {
  argument: Argument
  currentUserId?: string
  onVoteChange: () => void
  isDebateExpired: boolean
  onArgumentUpdate?: () => void
}

export function ArgumentCard({
  argument,
  currentUserId,
  onVoteChange,
  isDebateExpired,
  onArgumentUpdate,
}: ArgumentCardProps) {

  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(argument.content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const isAuthor = currentUserId === argument.author.id
  const canEdit = isAuthor && canEditArgument(new Date(argument.createdAt))

  const handleVote = async () => {
    if (isAuthor || isDebateExpired) return
    setIsVoting(true)
    try {
      const response = await fetch(`/api/arguments/${argument.id}/vote`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setHasVoted(data.voted)
        onVoteChange()
      }
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleEdit = async () => {
    if (!canEdit || editedContent.trim() === argument.content) {
      setIsEditing(false)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/arguments/${argument.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      })

      if (response.ok) {
        toast({
          title: "Argument updated",
          description: "Your argument has been successfully updated.",
        })
        setIsEditing(false)
        
        if (onArgumentUpdate) onArgumentUpdate()
      } else {
        const error = await response.json()
        if (error.toxicWords) {
          toast({
            variant: "destructive",
            title: "Moderation alert",
            description: `Your argument contains inappropriate language: ${error.toxicWords.join(", ")}`,
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update argument. Please try again.",
          })
        }
      }
    } catch (error) {
      console.error("Error updating argument:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!canEdit) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/arguments/${argument.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Argument deleted",
          description: "Your argument has been successfully deleted.",
        })
        setIsDeleting(false)
        if (onArgumentUpdate) onArgumentUpdate()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete argument. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error deleting argument:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <>
      <Card
        className={`group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden ${
          argument.side === "SUPPORT"
            ? "border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/50"
            : "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-950/50"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-800 shadow-lg">
                <AvatarImage src={argument.author.image || ""} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                  {argument.author.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{argument.author.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(argument.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={argument.side === "SUPPORT" ? "default" : "destructive"}
                className={`shadow-sm ${
                  argument.side === "SUPPORT"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                }`}
              >
                {argument.side === "SUPPORT" ? (
                  <ThumbsUp className="mr-1 h-3 w-3" />
                ) : (
                  <ThumbsDown className="mr-1 h-3 w-3" />
                )}
                {argument.side === "SUPPORT" ? "Support" : "Oppose"}
              </Badge>

              {canEdit && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => setIsDeleting(true)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={4}
                className="resize-none bg-white/60 dark:bg-slate-800/60 border-0 shadow-md focus:shadow-lg transition-all duration-300"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={isSubmitting || editedContent.trim() === argument.content}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedContent(argument.content)
                  }}
                  className="bg-white/60 dark:bg-slate-800/60 border-0 shadow-md"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {argument.content}
              </p>

              <div className="flex items-center justify-between">
                <Button
                  variant={hasVoted ? "default" : "outline"}
                  size="sm"
                  onClick={handleVote}
                  disabled={isVoting || isAuthor || isDebateExpired}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    hasVoted
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg transform scale-105"
                      : "bg-white/60 dark:bg-slate-800/60 border-0 shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 dark:hover:from-pink-950 dark:hover:to-rose-950"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${hasVoted ? "fill-current" : ""}`} />
                  <span className="font-medium">{argument._count.votes}</span>
                </Button>

                {isAuthor && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    Your argument
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Argument?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. Your argument will be permanently removed from the debate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting} className="bg-white/60 dark:bg-slate-800/60 border-0 shadow-md">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg"
            >
              {isSubmitting ? "Deleting..." : "Delete Argument"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}