"use client";

import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 animate-fade-in-up">
      <Avatar className="w-8 h-8 border border-primary/50 flex-shrink-0">
        <AvatarFallback className="bg-primary/20 text-primary">
          <Bot className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center space-x-1 p-3 bg-secondary text-secondary-foreground rounded-xl rounded-bl-none shadow-md">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-0"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );
}

// Add keyframes for pulse to globals.css if not already available via Tailwind
// For simplicity, if globals.css is modified for keyframes:
/*
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.delay-0 { animation-delay: 0s; }
.delay-150 { animation-delay: 0.15s; }
.delay-300 { animation-delay: 0.3s; }
*/
