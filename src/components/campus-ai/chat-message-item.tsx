"use client";

import type { Message } from '@/types';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageItemProps {
  message: Message;
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-fade-in-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="w-8 h-8 border border-primary/50 flex-shrink-0">
          {/* Placeholder for AI image if available */}
          {/* <AvatarImage src="https://placehold.co/40x40.png" alt="AI Avatar" /> */}
          <AvatarFallback className="bg-primary/20 text-primary">
            <Bot className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] p-3 rounded-xl shadow-md",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        {/* Timestamp can be added here if needed, e.g., in a lighter, smaller font */}
        {/* <p className={cn("text-xs mt-1", isUser ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p> */}
      </div>
      {isUser && (
        <Avatar className="w-8 h-8 border border-accent/50 flex-shrink-0">
          {/* Placeholder for User image if available */}
          {/* <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" /> */}
          <AvatarFallback className="bg-accent/20 text-accent">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
