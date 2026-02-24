
'use client';

import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
  Users, UserCheck, Clock, Target, Award, GraduationCap,
  UserPlus, Briefcase, BookOpen, ThumbsUp, Share2, MessageSquare, MoreHorizontal
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';

// Data from hrmstrial2-main
const kpis = [
  { label: "Headcount", value: "120", change: "+5%", trend: "up", icon: Users },
  { label: "Active Agents", value: "100", change: "+2%", trend: "up", icon: UserCheck },
  { label: "Avg AHT", value: "5:30", change: "-1%", trend: "down", icon: Clock },
  { label: "FCR", value: "85%", change: "+3%", trend: "up", icon: Target },
  { label: "CSAT", value: "92%", change: "+1%", trend: "up", icon: Award },
  { label: "Trainee Pass Rate", value: "95%", change: "+2%", trend: "up", icon: GraduationCap },
];

const performanceData = [
  { day: "Week 1", score: 72 },
  { day: "Week 2", score: 68 },
  { day: "Week 3", score: 75 },
  { day: "Week 4", score: 65 },
  { day: "Week 5", score: 78 },
  { day: "Week 6", score: 70 },
  { day: "Week 7", score: 82 },
  { day: "Week 8", score: 76 },
  { day: "Week 9", score: 88 },
  { day: "Week 10", score: 85 },
  { day: "Week 11", score: 90 },
  { day: "Week 12", score: 87 },
];

const recentEvents = [
  { icon: UserPlus, text: "New hire, Alex, joined the team", time: "2 hours ago", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { icon: Briefcase, text: "Job posting for Customer Support Specialist created", time: "4 hours ago", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { icon: BookOpen, text: "Course 'Effective Communication' updated", time: "6 hours ago", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
];

const quickActions = [
  { label: "Create Role", gradient: "bg-gradient-to-r from-blue-500 to-cyan-500" },
  { label: "Create Job", gradient: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { label: "Create Course", gradient: "bg-gradient-to-r from-green-500 to-emerald-500" },
];

// Data from HRMS-master
const wallOfFame = [
    { name: 'Rajesh T.', empId: 'EMP009', badges: 12, avatar: 'https://ui-avatars.com/api/?name=Rajesh+T&background=random', crown: 'gold' },
    { name: 'Thiyagu B', empId: 'EMP010', badges: 10, avatar: 'https://ui-avatars.com/api/?name=Thiyagu+B&background=random', crown: 'silver' },
    { name: 'Prajwal', empId: 'EMP011', badges: 8, avatar: 'https://ui-avatars.com/api/?name=Prajwal&background=random', crown: 'bronze' },
];

const feedPosts = [
    {
        author: 'Divyashree',
        authorRole: 'Specialist',
        timestamp: '1 month ago',
        avatar: 'https://ui-avatars.com/api/?name=Divyashree&background=random',
        title: 'Employee Referral Program is Active!',
        image: 'https://placehold.co/800x400.png',
        imageHint: 'employee referral program'
    },
    {
        author: 'Jackson Lee',
        authorRole: 'Head of HR',
        timestamp: '2 months ago',
        avatar: 'https://ui-avatars.com/api/?name=Jackson+Lee&background=random',
        title: 'Annual Company Retreat Location Announced!',
        image: 'https://placehold.co/800x400.png',
        imageHint: 'company retreat beach'
    }
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.profile?.full_name?.split(" ")[0] || "there";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 p-4 md:p-6 pb-20 md:pb-6">
      <motion.div variants={item} className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Welcome back, {displayName}!</p>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={item}>
        <h2 className="text-sm font-semibold mb-3">Key Performance Indicators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-xs text-muted-foreground">{k.label}</p>
                 <k.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-1">{k.value}</p>
              <span className={`text-xs font-medium ${k.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {k.change}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-6">
              {/* Performance Chart */}
              <motion.div variants={item} className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                    <h3 className="text-sm font-semibold">Overall Performance</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold">90%</span>
                        <span className="text-xs text-green-500 font-medium">+5%</span>
                        <span className="text-xs text-muted-foreground">Last 30 Days</span>
                    </div>
                    </div>
                </div>
                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} domain={[60, 100]} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                        <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Feed & Updates */}
              <motion.div variants={item}>
                 <Tabs defaultValue="feed" className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold">Company Updates</h3>
                        <TabsList>
                            <TabsTrigger value="feed">Feed</TabsTrigger>
                            <TabsTrigger value="events">Events</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="feed" className="space-y-4">
                        {feedPosts.map((post, index) => (
                            <Card key={index}>
                                <CardHeader className="flex flex-row justify-between items-start p-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={post.avatar} />
                                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{post.author}</p>
                                            <p className="text-xs text-muted-foreground">{post.authorRole} • {post.timestamp}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 space-y-3">
                                    <p className="font-semibold leading-snug">{post.title}</p>
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                         <Image 
                                            alt={post.title} 
                                            fill
                                            className="object-cover" 
                                            src={post.image} />
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex space-x-4">
                                            <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary"><ThumbsUp className="w-4 h-4"/> <span>Like</span></button>
                                            <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary"><MessageSquare className="w-4 h-4"/> <span>Comment</span></button>
                                        </div>
                                        <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary"><Share2 className="w-4 h-4"/> <span>Share</span></button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                    <TabsContent value="events">
                        <div className="p-4 text-center text-muted-foreground bg-muted/30 rounded-lg">
                            No upcoming events scheduled.
                        </div>
                    </TabsContent>
                 </Tabs>
              </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
             {/* Quick Actions */}
             <motion.div variants={item} className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                {quickActions.map((a) => (
                    <button key={a.label} className={`w-full py-2.5 rounded-lg ${a.gradient} text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm`}>
                    {a.label}
                    </button>
                ))}
                </div>
            </motion.div>

             {/* Wall of Fame */}
             <motion.div variants={item} className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold">Wall of Fame</h3>
                    <Link href="#" className="text-xs text-primary hover:underline">View All</Link>
                </div>
                <div className="flex justify-around items-center text-center">
                    {wallOfFame.map((person, index) => (
                            <div key={index} className="flex flex-col items-center">
                            <div className={`relative p-1 rounded-full border-2 ${person.crown === 'gold' ? 'border-yellow-400' : person.crown === 'silver' ? 'border-gray-400' : 'border-amber-600'}`}>
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={person.avatar} alt={person.name} />
                                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <p className="mt-2 font-medium text-xs truncate w-16">{person.name.split(' ')[0]}</p>
                            <p className="text-[10px] text-muted-foreground">{person.badges} Badges</p>
                        </div>
                    ))}
                </div>
             </motion.div>

            {/* Recent Events */}
            <motion.div variants={item} className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                <h3 className="text-sm font-semibold mb-4">Recent Events</h3>
                <div className="space-y-4">
                {recentEvents.map((e, i) => (
                    <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${e.color} shrink-0`}>
                        <e.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{e.text}</p>
                        <p className="text-xs text-muted-foreground">{e.time}</p>
                    </div>
                    </div>
                ))}
                </div>
            </motion.div>
          </div>
      </div>
    </motion.div>
  );
}
