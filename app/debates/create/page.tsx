'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createDebateSchema, type CreateDebateInput } from "@/lib/validations/debate"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"


const CATEGORIES = [
  "Technology",
  "Politics",
  "Science",
  "Ethics",
  "Sports",
  "Entertainment",
  "Education",
  "Environment",
  "Health",
  "Business",
]

const DURATION_OPTIONS = [
  { value: 60, label: "1 Hour" },
  { value: 360, label: "6 Hours" },
  { value: 720, label: "12 Hours" },
  { value: 1440, label: "1 Day" },
  { value: 2880, label: "2 Days" },
  { value: 4320, label: "3 Days" },
  { value: 10080, label: "1 Week" },
]

export default function CreateDebatePage() {
  
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTag, setCurrentTag] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = useForm<CreateDebateInput>({
    resolver: zodResolver(createDebateSchema),
    defaultValues: {
      tags: [],
      duration: 1440, //! 1 day default
    },
  })

  const watchedTags = watch("tags")
  const watchedCategory = watch("category")
  const watchedDuration = watch("duration")

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const addTag = () => {
    if (currentTag.trim() && !watchedTags.includes(currentTag.trim())) {
      if (watchedTags.length >= 5) {
        setError("tags", { message: "Maximum 5 tags allowed" })
        return
      }
      setValue("tags", [...watchedTags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove),
    )
  }

  const onSubmit = async (data: CreateDebateInput) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/debates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const debate = await response.json()
        router.push(`/debates/${debate.id}`)
      } else {
        const error = await response.json()
        console.error("Error creating debate:", error)
      }
    } catch (error) {
      console.error("Error creating debate:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Debate</CardTitle>
            <CardDescription>Start a new debate and let the community battle it out with their opinions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Enter a compelling debate title..." {...register("title")} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide context and background for your debate topic..."
                  rows={4}
                  {...register("description")}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={watchedCategory} onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {watchedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchedTags.map((tag) => (
                      <Badge key={tag} onClick={() => removeTag(tag)} variant="secondary" className="flex items-center gap-1 cursor-pointer!">
                        {tag}
                        <X className="size-6"  />
                      </Badge>
                      
                    ))}
                  </div>
                )}

                {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Banner Image URL (Optional)</Label>
                <Input id="imageUrl" type="url" placeholder="https://example.com/image.jpg" {...register("imageUrl")} />
                {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Debate Duration *</Label>
                <Select
                  value={watchedDuration?.toString()}
                  onValueChange={(value) => setValue("duration", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating..." : "Create Debate"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    
  )
}