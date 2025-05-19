"use client";

import type { Message } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Mic, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { handleUserMessage } from '@/lib/actions/chat.actions';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessageItem from './chat-message-item';
import TypingIndicator from './typing-indicator';
import { useToast } from '@/hooks/use-toast';


const welcomeMessage: Message = {
  id: uuidv4(),
  text: "Hey! I’m your AI-powered assistant for all things college — from applications to scholarships to student hacks. Ask me anything!",
  sender: 'ai',
  timestamp: new Date(),
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const query = inputValue.trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      text: query,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await handleUserMessage(query);
      const aiMessage: Message = {
        id: uuidv4(),
        text: aiResponse.answer,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: "Error",
        description: "Could not connect to the AI. Please check your connection or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl h-[70vh] md:h-[80vh] shadow-2xl flex flex-col bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in-up animation-delay-400">
      <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>
      <CardFooter className="p-4 md:p-6 border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary flex-shrink-0" disabled={isLoading} aria-label="Use Microphone">
            <Mic className="w-5 h-5" />
          </Button>
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about college..."
            className="flex-grow resize-none focus-visible:ring-1 focus-visible:ring-primary/80 bg-input/50 placeholder:text-muted-foreground/80"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button type="submit" variant="default" size="icon" disabled={isLoading || !inputValue.trim()} className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground" aria-label="Send Message">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
