// 'use client';


// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Award, Crown, Medal, MessageSquare, Star, Trophy, Users, Zap } from "lucide-react";
// import { useEffect, useState } from "react";


// interface ScoreboardEntry {
//   id: string
//   name: string
//   image?: string
//   totalVotes: number
//   debatesParticipated: number
// }

// const PERIOD_OPTIONS = [
//   { value: "all-time", label: "All Time", icon: Crown },
//   { value: "monthly", label: "This Month", icon: Star },
//   { value: "weekly", label: "This Week", icon: Zap },
// ]


// export default function ScoreboardPage() {
//   const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([])
//   const [loading, setLoading] = useState(true)
//   const [period, setPeriod] = useState("all-time")

//   const fetchScoreboard = async (selectedPeriod: string) => {
//     setLoading(true)
//     try {
//       const response = await fetch(`/api/scoreboard?period=${selectedPeriod}&limit=50`)
//       if (response.ok) {
//         const data = await response.json()
//         setScoreboard(data)
//       }
//     } catch (error) {
//       console.error("Error fetching scoreboard:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchScoreboard(period)
//   }, [period])

//   const getRankIcon = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return <Trophy className="h-6 w-6 text-yellow-500" />
//       case 2:
//         return <Medal className="h-6 w-6 text-gray-400" />
//       case 3:
//         return <Award className="h-6 w-6 text-amber-600" />
//       default:
//         return (
//           <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
//             <span className="text-sm font-bold text-slate-700 dark:text-slate-300">#{rank}</span>
//           </div>
//         )
//     }
//   }

//   const getRankBadge = (rank: number) => {
//     if (rank === 1)
//       return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">🏆 Champion</Badge>
//     if (rank <= 3)
//       return <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md">🥈 Elite</Badge>
//     if (rank <= 10)
//       return (
//         <Badge
//           variant="outline"
//           className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800"
//         >
//           ⭐ Top 10
//         </Badge>
//       )
//     return null
//   }

//   const selectedPeriod = PERIOD_OPTIONS.find((option) => option.value === period) || PERIOD_OPTIONS[0]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12 relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-3xl blur-3xl -z-10" />
//           <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
//             <div className="flex items-center justify-center mb-4">
//               <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
//                 <Trophy className="h-8 w-8 text-white" />
//               </div>
//             </div>
//             <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
//               Hall of Champions
//             </h1>
//             <p className="text-muted-foreground text-lg">
//               Celebrating our most influential debaters and thought leaders
//             </p>
//           </div>
//         </div>

//         <Tabs value={period} onValueChange={setPeriod} className="space-y-8">
//           <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-xl">
//             {PERIOD_OPTIONS.map((option) => (
//               <TabsTrigger
//                 key={option.value}
//                 value={option.value}
//                 className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
//               >
//                 <option.icon className="h-4 w-4" />
//                 {option.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>

//           {PERIOD_OPTIONS.map((option) => (
//             <TabsContent key={option.value} value={option.value}>
//               {loading ? (
//                 <div className="text-center py-12">
//                   <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full shadow-lg">
//                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-600 border-t-transparent"></div>
//                     <span className="font-medium">Loading champions...</span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-8">
//                   {/* Top 3 Podium */}
//                   {scoreboard.length >= 3 && (
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//                       {/* 2nd Place */}
//                       <Card className="text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl transform hover:scale-105 transition-all duration-300">
//                         <CardHeader className="pb-4">
//                           <div className="flex justify-center mb-4">
//                             <div className="p-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full shadow-lg">
//                               <Medal className="h-8 w-8 text-white" />
//                             </div>
//                           </div>
//                           <Avatar className="h-20 w-20 mx-auto ring-4 ring-gray-300 shadow-xl">
//                             <AvatarImage src={scoreboard[1]?.image || ""} />
//                             <AvatarFallback className="bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xl font-bold">
//                               {scoreboard[1]?.name?.[0]}
//                             </AvatarFallback>
//                           </Avatar>
//                         </CardHeader>
//                         <CardContent>
//                           <h3 className="font-bold text-lg mb-2">{scoreboard[1]?.name}</h3>
//                           <p className="text-sm text-muted-foreground mb-3">
//                             <span className="font-semibold text-gray-600 dark:text-gray-400">
//                               {scoreboard[1]?.totalVotes}
//                             </span>{" "}
//                             votes earned
//                           </p>
//                           <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md">
//                             🥈 Silver Champion
//                           </Badge>
//                         </CardContent>
//                       </Card>

//                       {/* 1st Place */}
//                       <Card className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-0 shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
//                         <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10" />
//                         <CardHeader className="pb-4 relative">
//                           <div className="flex justify-center mb-4">
//                             <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-xl animate-pulse">
//                               <Trophy className="h-10 w-10 text-white" />
//                             </div>
//                           </div>
//                           <Avatar className="h-24 w-24 mx-auto ring-4 ring-yellow-400 shadow-2xl">
//                             <AvatarImage src={scoreboard[0]?.image || ""} />
//                             <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-2xl font-bold">
//                               {scoreboard[0]?.name?.[0]}
//                             </AvatarFallback>
//                           </Avatar>
//                         </CardHeader>
//                         <CardContent className="relative">
//                           <h3 className="font-bold text-xl mb-2 text-yellow-800 dark:text-yellow-200">
//                             {scoreboard[0]?.name}
//                           </h3>
//                           <p className="text-sm text-muted-foreground mb-4">
//                             <span className="font-bold text-orange-600 dark:text-orange-400 text-lg">
//                               {scoreboard[0]?.totalVotes}
//                             </span>{" "}
//                             votes earned
//                           </p>
//                           <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg text-sm px-4 py-1">
//                             👑 Grand Champion
//                           </Badge>
//                         </CardContent>
//                       </Card>

//                       {/* 3rd Place */}
//                       <Card className="text-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 border-0 shadow-xl transform hover:scale-105 transition-all duration-300">
//                         <CardHeader className="pb-4">
//                           <div className="flex justify-center mb-4">
//                             <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full shadow-lg">
//                               <Award className="h-8 w-8 text-white" />
//                             </div>
//                           </div>
//                           <Avatar className="h-20 w-20 mx-auto ring-4 ring-amber-400 shadow-xl">
//                             <AvatarImage src={scoreboard[2]?.image || ""} />
//                             <AvatarFallback className="bg-gradient-to-r from-amber-500 to-amber-700 text-white text-xl font-bold">
//                               {scoreboard[2]?.name?.[0]}
//                             </AvatarFallback>
//                           </Avatar>
//                         </CardHeader>
//                         <CardContent>
//                           <h3 className="font-bold text-lg mb-2">{scoreboard[2]?.name}</h3>
//                           <p className="text-sm text-muted-foreground mb-3">
//                             <span className="font-semibold text-amber-600 dark:text-amber-400">
//                               {scoreboard[2]?.totalVotes}
//                             </span>{" "}
//                             votes earned
//                           </p>
//                           <Badge className="bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-md">
//                             🥉 Bronze Champion
//                           </Badge>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   )}

//                   {/* Full Leaderboard */}
//                   <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-xl">
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-3 text-2xl">
//                         <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
//                           <selectedPeriod.icon className="h-6 w-6 text-white" />
//                         </div>
//                         Complete Rankings - {option.label}
//                       </CardTitle>
//                       <CardDescription className="text-base">
//                         Full leaderboard showcasing all community champions
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         {scoreboard.map((entry, index) => (
//                           <div
//                             key={entry.id}
//                             className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
//                               index < 3
//                                 ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800"
//                                 : "bg-white/60 dark:bg-slate-800/60 border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80"
//                             }`}
//                           >
//                             <div className="flex items-center justify-center w-12">{getRankIcon(index + 1)}</div>

//                             <Avatar className={`h-12 w-12 shadow-lg ${index < 3 ? "ring-2 ring-yellow-400" : ""}`}>
//                               <AvatarImage src={entry.image || ""} />
//                               <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
//                                 {entry.name?.[0]}
//                               </AvatarFallback>
//                             </Avatar>

//                             <div className="flex-1">
//                               <div className="flex items-center gap-3 mb-1">
//                                 <h4 className="font-semibold text-lg">{entry.name}</h4>
//                                 {getRankBadge(index + 1)}
//                               </div>
//                               <div className="flex items-center gap-6 text-sm text-muted-foreground">
//                                 <div className="flex items-center gap-2 px-3 py-1 bg-pink-50 dark:bg-pink-950 rounded-full">
//                                   <MessageSquare className="h-3 w-3 text-pink-600 dark:text-pink-400" />
//                                   <span className="font-medium text-pink-700 dark:text-pink-300">
//                                     {entry.totalVotes} votes
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950 rounded-full">
//                                   <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />
//                                   <span className="font-medium text-blue-700 dark:text-blue-300">
//                                     {entry.debatesParticipated} debates
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             {index < 3 && (
//                               <div className="text-yellow-500 animate-pulse">
//                                 <Star className="h-6 w-6 fill-current" />
//                               </div>
//                             )}
//                           </div>
//                         ))}

//                         {scoreboard.length === 0 && (
//                           <div className="text-center py-12">
//                             <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full w-fit mx-auto mb-4">
//                               <Trophy className="h-12 w-12 text-blue-600 dark:text-blue-400" />
//                             </div>
//                             <h3 className="text-xl font-semibold mb-2">No champions yet</h3>
//                             <p className="text-muted-foreground">Be the first to earn votes and claim your spot!</p>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               )}
//             </TabsContent>
//           ))}
//         </Tabs>
//       </div>
//     </div>
//   )
// }

//! Try - 1
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Crown, Medal, MessageSquare, Star, Trophy, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface ScoreboardEntry {
  id: string
  name: string
  image?: string
  totalVotes: number
  debatesParticipated: number
}

const PERIOD_OPTIONS = [
  { value: "all-time", label: "All Time", icon: Crown },
  { value: "monthly", label: "This Month", icon: Star },
  { value: "weekly", label: "This Week", icon: Zap },
]

export default function ScoreboardPage() {
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("all-time")

  const fetchScoreboard = async (selectedPeriod: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/scoreboard?period=${selectedPeriod}&limit=50`)
      if (response.ok) {
        const data = await response.json()
        setScoreboard(data)
      }
    } catch (error) {
      console.error("Error fetching scoreboard:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScoreboard(period)
  }, [period])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">#{rank}</span>
          </div>
        )
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return <Badge className="bg-amber-500 text-white">🏆 Champion</Badge>
    if (rank <= 3)
      return <Badge className="bg-blue-500 text-white">🥈 Elite</Badge>
    if (rank <= 10)
      return <Badge className="bg-purple-500 text-white">⭐ Top 10</Badge>
    return null
  }

  const selectedPeriod = PERIOD_OPTIONS.find((option) => option.value === period) || PERIOD_OPTIONS[0]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Card className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-500 rounded-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-slate-800 dark:text-slate-200">
                Hall of Champions
              </CardTitle>
              <CardDescription className="text-slate-700 dark:text-slate-300">
                Celebrating our most influential debaters and thought leaders
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs value={period} onValueChange={setPeriod} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            {PERIOD_OPTIONS.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {PERIOD_OPTIONS.map((option) => (
            <TabsContent key={option.value} value={option.value}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-full border border-blue-200 dark:border-blue-800">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Loading champions...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Top 3 Podium */}
                  {scoreboard.length >= 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      {/* 2nd Place */}
                      <Card className="text-center bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 shadow-lg">
                        <CardHeader className="pb-4">
                          <div className="flex justify-center mb-4">
                            <div className="p-3 bg-blue-500 rounded-full">
                              <Medal className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <Avatar className="h-20 w-20 mx-auto ring-2 ring-blue-300 dark:ring-blue-700">
                            <AvatarImage src={scoreboard[1]?.image || ""} />
                            <AvatarFallback className="bg-blue-500 text-white text-xl font-bold">
                              {scoreboard[1]?.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">
                            {scoreboard[1]?.name}
                          </h3>
                          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {scoreboard[1]?.totalVotes}
                            </span>{" "}
                            votes earned
                          </p>
                          <Badge className="bg-blue-500 text-white">
                            🥈 Silver Champion
                          </Badge>
                        </CardContent>
                      </Card>

                      {/* 1st Place */}
                      <Card className="text-center bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 shadow-xl">
                        <CardHeader className="pb-4">
                          <div className="flex justify-center mb-4">
                            <div className="p-4 bg-amber-500 rounded-full">
                              <Trophy className="h-10 w-10 text-white" />
                            </div>
                          </div>
                          <Avatar className="h-24 w-24 mx-auto ring-2 ring-amber-400">
                            <AvatarImage src={scoreboard[0]?.image || ""} />
                            <AvatarFallback className="bg-amber-500 text-white text-2xl font-bold">
                              {scoreboard[0]?.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-bold text-xl mb-2 text-amber-800 dark:text-amber-200">
                            {scoreboard[0]?.name}
                          </h3>
                          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                            <span className="font-bold text-amber-600 dark:text-amber-400 text-lg">
                              {scoreboard[0]?.totalVotes}
                            </span>{" "}
                            votes earned
                          </p>
                          <Badge className="bg-amber-500 text-white text-sm px-4 py-1">
                            👑 Grand Champion
                          </Badge>
                        </CardContent>
                      </Card>

                      {/* 3rd Place */}
                      <Card className="text-center bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 shadow-lg">
                        <CardHeader className="pb-4">
                          <div className="flex justify-center mb-4">
                            <div className="p-3 bg-purple-500 rounded-full">
                              <Award className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <Avatar className="h-20 w-20 mx-auto ring-2 ring-purple-300 dark:ring-purple-700">
                            <AvatarImage src={scoreboard[2]?.image || ""} />
                            <AvatarFallback className="bg-purple-500 text-white text-xl font-bold">
                              {scoreboard[2]?.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">
                            {scoreboard[2]?.name}
                          </h3>
                          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              {scoreboard[2]?.totalVotes}
                            </span>{" "}
                            votes earned
                          </p>
                          <Badge className="bg-purple-500 text-white">
                            🥉 Bronze Champion
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Full Leaderboard */}
                  <Card className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <selectedPeriod.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                          Complete Rankings - {option.label}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-slate-700 dark:text-slate-300">
                        Full leaderboard showcasing all community champions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {scoreboard.map((entry, index) => (
                          <div
                            key={entry.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border ${
                              index < 3
                                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                                : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center justify-center w-12">
                              {getRankIcon(index + 1)}
                            </div>

                            <Avatar className={`h-12 w-12 ${index < 3 ? "ring-2 ring-amber-400" : ""}`}>
                              <AvatarImage src={entry.image || ""} />
                              <AvatarFallback className="bg-blue-500 text-white font-semibold">
                                {entry.name?.[0]}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{entry.name}</h4>
                                {getRankBadge(index + 1)}
                              </div>
                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                  <MessageSquare className="h-4 w-4" />
                                  <span className="font-medium">{entry.totalVotes} votes</span>
                                </div>
                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                  <Users className="h-4 w-4" />
                                  <span className="font-medium">{entry.debatesParticipated} debates</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {scoreboard.length === 0 && (
                          <div className="text-center py-12">
                            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-4">
                              <Trophy className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">
                              No champions yet
                            </h3>
                            <p className="text-slate-700 dark:text-slate-300">
                              Be the first to earn votes and claim your spot!
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
