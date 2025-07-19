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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl -z-10" />
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Explore Debates
                </h1>
              </div>
              <p className="text-muted-foreground">Discover engaging discussions and join the conversation</p>
            </div>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/debates/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Debate
            </Link>
          </Button>
        </div>

        {/* Enhanced Filters */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <span>Find Your Perfect Debate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search debates..."
                  value={filters.search}
                  onChange={(e) => updateFilters("search", e.target.value)}
                  className="pl-10 bg-white/60 dark:bg-slate-800/60 border-0 shadow-md focus:shadow-lg focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
                />
              </div>

              <Select value={filters.category || "all"} onValueChange={(value) => updateFilters("category", value)}>
                <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 border-0 shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-300">
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
                <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 border-0 shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <selectedSortOption.icon className="h-4 w-4" />
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
                className="bg-white/60 dark:bg-slate-800/60 border-0 shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950 dark:hover:to-pink-950 transition-all duration-300"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-blue-600 dark:text-blue-400">{pagination.total}</span> debates
              {filters.search && ` matching "${filters.search}"`}
              {filters.category && filters.category !== "all" && ` in ${filters.category}`}
            </p>
          </div>
        )}

        {/* Debates List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full shadow-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <span className="font-medium">Loading amazing debates...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8">
              {debates.map((debate, index) => (
                <Card
                  key={debate.id}
                  className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 border-0 shadow-sm"
                          >
                            {debate.category}
                          </Badge>
                          {index < 3 && (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm animate-pulse">
                              <Fire className="mr-1 h-3 w-3" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2 mb-3 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          <Link href={`/debates/${debate.id}`} className="hover:underline">
                            {debate.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-base leading-relaxed">
                          {debate.description}
                        </CardDescription>
                      </div>
                      {debate.imageUrl && (
                        <div className="ml-6 relative group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={debate.imageUrl || "/placeholder.svg"}
                            alt={debate.title}
                            className="w-24 h-24 object-cover rounded-xl shadow-lg"
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
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-md"
                          onClick={() => updateFilters("tag", tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950 rounded-full">
                          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-blue-700 dark:text-blue-300">
                            {debate._count.participations}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950 rounded-full">
                          <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {debate._count.arguments}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-950 rounded-full">
                          <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          <span className="font-medium text-orange-700 dark:text-orange-300">
                            {formatTimeRemaining(new Date(debate.expiresAt))}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
                        <Avatar className="h-6 w-6 ring-2 ring-white dark:ring-slate-700 shadow-sm">
                          <AvatarImage src={debate.creator.image || ""} />
                          <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
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
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="text-center py-12">
                  <div className="mb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full w-fit mx-auto">
                      <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No debates found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria or create a new debate!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="bg-white/60 dark:bg-slate-800/60 border-0 shadow-md"
                    >
                      Clear Filters
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
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
                  className="bg-white/60 dark:bg-slate-800/60 border-0 shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300"
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
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "bg-white/60 dark:bg-slate-800/60 border-0 shadow-md hover:shadow-lg"
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
                  className="bg-white/60 dark:bg-slate-800/60 border-0 shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300"
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