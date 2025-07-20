'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatTimeRemaining } from "@/lib/utils/time";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Clock,
  Filter,
  FlameIcon as Fire,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Debate {
  id: string
  title: string
  description: string
  tags: string[]
  category: string
  imageUrl?: string
  expiresAt: string
  creator: {
    id: string
    name: string
    image?: string
  }
  _count: {
    participations: number
    arguments: number
  }
}

interface DebatesResponse {
  debates: Debate[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

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

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First", icon: Sparkles },
  { value: "oldest", label: "Oldest First", icon: Clock },
  { value: "ending-soon", label: "Ending Soon", icon: Fire },
  { value: "most-voted", label: "Most Popular", icon: TrendingUp },
]


export default function DebatesPage() {
  const [debates, setDebates] = useState<Debate[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    tag: searchParams.get("tag") || "",
    sort: searchParams.get("sort") || "newest",
  })

  const fetchDebates = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (filters.search.trim()) {
        params.set("search", filters.search)
      }
      if (filters.category && filters.category !== "all") {
        params.set("category", filters.category)
      }
      if (filters.tag.trim()) {
        params.set("tag", filters.tag)
      }
      if (filters.sort) {
        params.set("sort", filters.sort)
      }

      const response = await fetch(`/api/debates?${params}`)
      if (response.ok) {
        const data: DebatesResponse = await response.json()
        setDebates(data.debates)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching debates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebates(1)
  }, [filters])

  const updateFilters = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== "all") params.set(k, v)
    })
    const queryString = params.toString()
    router.push(`/debates${queryString ? `?${queryString}` : ""}`)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      tag: "",
      sort: "newest",
    })
    router.push("/debates")
  }

  const selectedSortOption = SORT_OPTIONS.find((option) => option.value === filters.sort) || SORT_OPTIONS[0]


  return(
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="relative w-full mb-8">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-2xl blur-3xl -z-10" />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 dark:border-blue-800 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                Explore Debates
              </h1>
            </div>
            <p className="text-slate-700 dark:text-slate-300">Discover engaging discussions and join the conversation</p>
          </div>
        </div>

        {/* Enhanced Filters */}
        <Card className="mb-8 bg-white dark:bg-slate-900 dark:border-blue-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <span className="text-slate-800 dark:text-slate-200">Find Your Perfect Debate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search debates..."
                  value={filters.search}
                  onChange={(e) => updateFilters("search", e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <Select value={filters.category || "all"} onValueChange={(value) => updateFilters("category", value)}>
                <SelectTrigger className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.sort} onValueChange={(value) => updateFilters("sort", value)}>
                <SelectTrigger className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={clearFilters}
                // className="border border-slate-300 dark:border-slate-700"
                className="bg-white/90 dark:bg-slate-800/80 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Found <span className="font-semibold text-blue-600 dark:text-blue-400">{pagination.total}</span> debates
              {filters.search && ` matching "${filters.search}"`}
              {filters.category && filters.category !== "all" && ` in ${filters.category}`}
            </p>
          </div>
        )}

        {/* Debates List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-full dark:border-blue-800">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Loading amazing debates...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8">
              {debates.map((debate, index) => (
                <Card
                  key={debate.id}
                  className="bg-white dark:bg-slate-900 dark:border-blue-800 shadow-lg overflow-hidden"
                >
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          >
                            {debate.category}
                          </Badge>
                          {index < 3 && (
                            <Badge className="bg-amber-500 text-white">
                              <Fire className="mr-1 h-3 w-3" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="mb-3 text-xl text-slate-800 dark:text-slate-200">
                          <Link href={`/debates/${debate.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                            {debate.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-slate-700 dark:text-slate-300">
                          {debate.description}
                        </CardDescription>
                      </div>
                      {debate.imageUrl && (
                        <div className="ml-6 relative">
                          <Image
                            src={debate.imageUrl || "/placeholder.svg"}
                            alt={debate.title}
                            className="w-24 h-24 object-cover rounded-xl"
                            width={96}
                            height={96}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {debate.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700"
                          onClick={() => updateFilters("tag", tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{debate._count.participations}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium">{debate._count.arguments}</span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {formatTimeRemaining(new Date(debate.expiresAt))}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 ring-2 ring-white dark:ring-slate-800">
                          <AvatarImage src={debate.creator.image || ""} />
                          <AvatarFallback className="text-xs bg-blue-500 text-white">
                            {debate.creator.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{debate.creator.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No results */}
            {debates.length === 0 && (
              <Card className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800">
                <CardContent className="text-center py-12">
                  <div className="mb-6">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto">
                      <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">No debates found</h3>
                  <p className="text-slate-700 dark:text-slate-300 mb-6">
                    Try adjusting your search criteria or create a new debate!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="border border-slate-300 dark:border-slate-700"
                    >
                      Clear Filters
                    </Button>
                    <Button
                      asChild
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <Link href="/debates/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Debate
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => fetchDebates(pagination.page - 1)}
                  className="border border-slate-300 dark:border-slate-700 disabled:opacity-50"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => fetchDebates(pageNum)}
                        className={
                          pagination.page === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-slate-300 dark:border-slate-700"
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchDebates(pagination.page + 1)}
                  className="border border-slate-300 dark:border-slate-700 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}