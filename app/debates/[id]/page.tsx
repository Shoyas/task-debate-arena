/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ArgumentCard } from "@/components/argument-card";
import { ArgumentForm } from "@/components/argument-form";
import { JoinDebateDialog } from "@/components/join-debate-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { formatTimeRemaining, isDebateExpired } from "@/lib/utils/time";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Clock, MessageSquare, Share2, Trophy, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";





interface Debate {
  id: string
  title: string
  description: string
  tags: string[]
  category: string
  imageUrl?: string
  expiresAt: string
  isActive: boolean
  winningSide?: "SUPPORT" | "OPPOSE"
  creator: {
    id: string
    name: string
    image?: string
  }
  participations: Array<{
    id: string
    side: "SUPPORT" | "OPPOSE"
    joinedAt: string
    firstArgumentPostedAt?: string
    user: {
      id: string
      name: string
      image?: string
    }
  }>
  arguments: Array<{
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
  }>
  _count: {
    participations: number
    arguments: number
  }
}

export default function DebateDetailPage() {

  const { data: session } = useSession()
  const params = useParams()
  const [debate, setDebate] = useState<Debate | null>(null)
  const [loading, setLoading] = useState(true)
  const [userParticipation, setUserParticipation] = useState<any>(null)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [replyTimerExpired, setReplyTimerExpired] = useState(false)
  const { toast } = useToast()

  const fetchDebate = async () => {
    try {
      const response = await fetch(`/api/debates/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setDebate(data)

        // Check if user has joined this debate
        if (session?.user?.id) {
          const participation = data.participations.find((p: any) => p.user.id === session.user.id)
          setUserParticipation(participation)

          // Check reply timer
          if (participation && !participation.firstArgumentPostedAt) {
            const joinedAt = new Date(participation.joinedAt)
            const fiveMinutesAfterJoining = new Date(joinedAt.getTime() + 5 * 60 * 1000)
            setReplyTimerExpired(new Date() > fiveMinutesAfterJoining)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching debate:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebate()
  }, [params.id, session])

  const handleJoinSuccess = () => {
    setShowJoinDialog(false)
    fetchDebate()
  }

  const handleArgumentSubmit = () => {
    fetchDebate()
  }

  const handleShareDebate = () => {
    if (navigator.share) {
      navigator.share({
        title: debate?.title || "Community Debate Arena",
        text: debate?.description || "Join this debate!",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Debate link copied to clipboard",
      })
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!debate) {
    return <div className="container mx-auto px-4 py-8">Debate not found</div>
  }

  const isExpired = isDebateExpired(new Date(debate.expiresAt))
  const supportArguments = debate.arguments.filter((arg) => arg.side === "SUPPORT")
  const opposeArguments = debate.arguments.filter((arg) => arg.side === "OPPOSE")

  const supportVotes = supportArguments.reduce((sum, arg) => sum + arg._count.votes, 0)
  const opposeVotes = opposeArguments.reduce((sum, arg) => sum + arg._count.votes, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Debate Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{debate.category}</Badge>
                  {isExpired && (
                    <Badge variant="destructive">
                      <Clock className="mr-1 h-3 w-3" />
                      Expired
                    </Badge>
                  )}
                  {debate.winningSide && (
                    <Badge variant="default">
                      <Trophy className="mr-1 h-3 w-3" />
                      {debate.winningSide === "SUPPORT" ? "Support" : "Oppose"} Won
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-2xl mb-2">{debate.title}</CardTitle>
                <CardDescription className="text-base">{debate.description}</CardDescription>

                <div className="flex flex-wrap gap-2 mt-4">
                  {debate.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {debate.imageUrl && (
                <Image
                  src={debate.imageUrl || "/placeholder.svg"}
                  alt={debate.title}
                  className="w-32 h-32 object-cover rounded-lg ml-6"
                  width={200}
                  height={200}
                />
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {debate._count.participations} participants
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {debate._count.arguments} arguments
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {isExpired ? "Expired" : formatTimeRemaining(new Date(debate.expiresAt))}
                </div>
                <Button variant="ghost" size="sm" onClick={handleShareDebate} className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={debate.creator.image || ""} />
                  <AvatarFallback>{debate.creator.name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">Created by {debate.creator.name}</span>
              </div>
            </div>

            {/* Join Debate Button */}
            {session && !userParticipation && !isExpired && (
              <div className="mt-4">
                <Button onClick={() => setShowJoinDialog(true)}>Join Debate</Button>
              </div>
            )}

            {/* User's Side */}
            {userParticipation && (
              <div className="mt-4 p-3 bg-accent rounded-lg">
                <p className="text-sm">
                  You joined the <strong>{userParticipation.side === "SUPPORT" ? "Support" : "Oppose"}</strong> side
                </p>

                {/* Reply Timer Warning */}
                {userParticipation && !userParticipation.firstArgumentPostedAt && !isExpired && (
                  <p className={`text-sm mt-1 ${replyTimerExpired ? "text-destructive" : "text-amber-500"}`}>
                    {replyTimerExpired
                      ? "Your 5-minute window to post your first argument has expired!"
                      : "You must post your first argument within 5 minutes of joining."}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vote Tally */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Vote Tally</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{supportVotes}</div>
                <div className="text-sm text-muted-foreground">Support Votes</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{opposeVotes}</div>
                <div className="text-sm text-muted-foreground">Oppose Votes</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 transition-all duration-300"
                  style={{
                    width: `${supportVotes + opposeVotes > 0 ? (supportVotes / (supportVotes + opposeVotes)) * 100 : 50}%`,
                  }}
                />
                <div
                  className="bg-red-500 transition-all duration-300"
                  style={{
                    width: `${supportVotes + opposeVotes > 0 ? (opposeVotes / (supportVotes + opposeVotes)) * 100 : 50}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arguments Section */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Arguments ({debate.arguments.length})</TabsTrigger>
            <TabsTrigger value="support">Support ({supportArguments.length})</TabsTrigger>
            <TabsTrigger value="oppose">Oppose ({opposeArguments.length})</TabsTrigger>
          </TabsList>

          {/* Argument Form */}
          {userParticipation && !isExpired && (
            <ArgumentForm debateId={debate.id} userSide={userParticipation.side} onSubmit={handleArgumentSubmit} />
          )}

          <TabsContent value="all" className="space-y-4">
            {debate.arguments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No arguments posted yet. Be the first to share your opinion!</p>
                </CardContent>
              </Card>
            ) : (
              debate.arguments.map((argument) => (
                <ArgumentCard
                  key={argument.id}
                  argument={argument}
                  currentUserId={session?.user?.id}
                  onVoteChange={fetchDebate}
                  isDebateExpired={isExpired}
                  onArgumentUpdate={fetchDebate}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            {supportArguments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No support arguments yet.</p>
                </CardContent>
              </Card>
            ) : (
              supportArguments.map((argument) => (
                <ArgumentCard
                  key={argument.id}
                  argument={argument}
                  currentUserId={session?.user?.id}
                  onVoteChange={fetchDebate}
                  isDebateExpired={isExpired}
                  onArgumentUpdate={fetchDebate}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="oppose" className="space-y-4">
            {opposeArguments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No oppose arguments yet.</p>
                </CardContent>
              </Card>
            ) : (
              opposeArguments.map((argument) => (
                <ArgumentCard
                  key={argument.id}
                  argument={argument}
                  currentUserId={session?.user?.id}
                  onVoteChange={fetchDebate}
                  isDebateExpired={isExpired}
                  onArgumentUpdate={fetchDebate}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Join Debate Dialog */}
        <JoinDebateDialog
          open={showJoinDialog}
          onOpenChange={setShowJoinDialog}
          debateId={debate.id}
          debateTitle={debate.title}
          onSuccess={handleJoinSuccess}
        />
      </div>
    </div>
    
  )
}