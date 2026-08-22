'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { runPermissionedAgent } from '@/ai/tools';
import { cn } from '@/lib/utils';
import { OsHeader } from '@/components/workforce/os-header';

type Line = { role: 'user' | 'model'; content: string };

const STARTERS = [
  'Prepare everything required for onboarding the new frontend engineer joining Monday',
  'Approve pending leave',
  'What happens if we hire 20 developers?',
  'Why is attrition up?',
  'Can I claim internet reimbursement?',
  'Show me salary for Anika Sharma',
];

export default function ChatbotPage() {
  const { user } = useAuth();
  useDataQuery();
  const [messages, setMessages] = useState<Line[]>([
    {
      role: 'model',
      content:
        "I'm the HR Chief of Staff on this tenant. I can execute onboarding packs, approvals, simulations, and policy checks — not only answer “how many employees.”",
    },
  ]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || !user) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    const result = runPermissionedAgent(text, {
      name: user.profile.full_name,
      role: user.role,
      profileId: user.profile.id,
      employeeId: user.profile.employee_id,
    });
    setMessages((prev) => [...prev, { role: 'model', content: result.text }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto gap-4">
      <OsHeader
        kicker="AI HR Chief of Staff"
        title="Execute the workflow, don’t narrate it"
        lede="NAVOS-style agency: leave, joiners, reports, and simulations run against the same graph and your permissions."
      />
      <div className="flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <Button key={s} type="button" size="sm" variant="outline" onClick={() => send(s)}>
            {s.length > 42 ? `${s.slice(0, 40)}…` : s}
          </Button>
        ))}
      </div>
      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 p-0 min-h-0">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : '')}
                >
                  {message.role === 'model' && (
                    <Avatar className="w-9 h-9 border">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md rounded-lg px-4 py-3 text-sm whitespace-pre-wrap',
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && user && (
                    <Avatar className="w-9 h-9 border">
                      <AvatarImage src={user.profile.profile_picture_url} />
                      <AvatarFallback>{user.profile.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Prepare onboarding, simulate hiring, ask why…"
            />
            <Button type="submit" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
