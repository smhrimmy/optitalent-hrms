
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useParams } from 'next/navigation';

type Post = {
    id: string;
    author: string;
    authorRole: string;
    avatar: string;
    title: string;
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    image_url?: string;
};

function NewPostDialog({ onAddPost }: { onAddPost: (post: Post) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!title || !content) {
            toast({
                title: "Missing fields",
                description: "Please fill out both title and content for the post.",
                variant: "destructive"
            });
            return;
        }
        
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data: userData } = await supabase
                .from('users')
                .select('tenant_id, employees(id, job_title)')
                .eq('id', user.id)
                .single();
            
            if (!userData?.tenant_id || !userData.employees?.[0]?.id) throw new Error("Employee record not found");

            const { data, error } = await supabase.from('company_feed_posts').insert({
                tenant_id: userData.tenant_id,
                author_id: userData.employees[0].id,
                title,
                content
            }).select().single();

            if (error) throw error;

            const newPost: Post = {
                id: data.id,
                author: 'Me', // We could fetch name, but 'Me' is fine for immediate feedback
                authorRole: userData.employees[0].job_title,
                avatar: `https://ui-avatars.com/api/?name=Me&background=random`,
                title: data.title,
                content: data.content,
                timestamp: 'Just now',
                likes: 0,
                comments: 0
            };

            onAddPost(newPost);
            toast({
                title: "Post created!",
                description: "Your new post has been added to the company feed."
            });
            setIsOpen(false);
            setTitle('');
            setContent('');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Post
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Post</DialogTitle>
                    <DialogDescription>
                        Share an update with the entire company.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" rows={6} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publish Post
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function CompanyFeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const role = params.role as string;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: userData } = await supabase
                .from('users')
                .select('tenant_id')
                .eq('id', user.id)
                .single();
            
            if (!userData?.tenant_id) return;

            const { data, error } = await supabase
                .from('company_feed_posts')
                .select(`
                    id,
                    title,
                    content,
                    created_at,
                    employees (
                        job_title,
                        users ( full_name )
                    )
                `)
                .eq('tenant_id', userData.tenant_id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedPosts: Post[] = data.map((p: any) => ({
                    id: p.id,
                    author: p.employees?.users?.full_name || 'Unknown',
                    authorRole: p.employees?.job_title || 'Employee',
                    avatar: `https://ui-avatars.com/api/?name=${p.employees?.users?.full_name}&background=random`,
                    title: p.title,
                    content: p.content,
                    timestamp: new Date(p.created_at).toLocaleString(),
                    likes: Math.floor(Math.random() * 50), // Mock likes for now as table doesn't have them
                    comments: Math.floor(Math.random() * 10)
                }));
                setPosts(mappedPosts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPost = (post: Post) => {
        setPosts(prev => [post, ...prev]);
        // Re-fetch to get correct author details if needed, but local update is faster
        fetchPosts(); 
    };
    
    const handleLike = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    };

    const handleComment = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold font-headline">Company Feed</h1>
          <p className="text-muted-foreground">
            Stay up-to-date with the latest news and announcements.
          </p>
        </div>
        {(role === 'admin' || role === 'hr' || role === 'super-admin') && <NewPostDialog onAddPost={handleAddPost} />}
      </div>

      {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : posts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">No posts yet. Be the first to share something!</div>
      ) : (
        <div className="space-y-6">
            {posts.map((post) => (
            <Card key={post.id} className="max-w-3xl mx-auto">
                <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar>
                    <AvatarImage src={post.avatar} data-ai-hint="person avatar"/>
                    <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                    <CardTitle className="text-lg">{post.author}</CardTitle>
                    <CardDescription>{post.authorRole} • {post.timestamp}</CardDescription>
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                <h2 className="text-xl font-semibold mb-2 font-headline">{post.title}</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
                </CardContent>
                <CardFooter className="flex gap-4">
                <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                    Like ({post.likes})
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleComment(post.id)}>
                    Comment ({post.comments})
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
}
