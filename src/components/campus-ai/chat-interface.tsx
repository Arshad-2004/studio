
"use client";

import type { Message } from '@/types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, User, Send, Mic, Loader2, RefreshCw, Sun, Moon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { handleUserMessage } from '@/lib/actions/chat.actions';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ChatMessageItem from './chat-message-item';
import TypingIndicator from './typing-indicator';
import { useToast } from '@/hooks/use-toast';

const welcomeMessage: Message = {
  id: uuidv4(),
  text: "Hey! I’m CollegeGPT, your AI-powered assistant for all things college — from applications to scholarships to student hacks. Ask me anything!",
  sender: 'ai',
  timestamp: new Date(),
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      // Default to dark if no preference or if system prefers dark
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const handleThemeToggle = (isDark: boolean) => {
    const newTheme = isDark ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', isDark);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleResetChat = useCallback(() => {
    setMessages([welcomeMessage]);
    setInputValue('');
    setIsLoading(false);
    if (isListening && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsListening(false);
    toast({
      title: "Chat Reset",
      description: "The conversation has been cleared.",
    });
  }, [isListening, toast]);


  const handleSubmit = async () => {
    const query = inputValue.trim();
    if (!query || isLoading || isListening) return;

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
      const errorMessageText = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.";
      const errorMessage: Message = {
        id: uuidv4(),
        text: errorMessageText,
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

  const handleMicClick = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast({
        title: "Unsupported Feature",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          if (!speechRecognitionRef.current) {
            speechRecognitionRef.current = new SpeechRecognitionAPI();
            const recognition = speechRecognitionRef.current;
            
            recognition.continuous = false; 
            recognition.interimResults = false; 
            recognition.lang = 'en-US'; 

            recognition.onstart = () => {
              setIsListening(true);
              setInputValue(''); 
              toast({ title: "Listening...", description: "Speak now.", duration: 5000 });
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
              const transcript = event.results[0][0].transcript;
              setInputValue(transcript);
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
              console.error("Speech recognition error", event.error, event.message);
              let errorMessageText = `An unknown speech error occurred: ${event.error}.`;
              if (event.error === 'no-speech') {
                errorMessageText = "No speech was detected. Please try again.";
              } else if (event.error === 'audio-capture') {
                errorMessageText = "Audio capture failed. Ensure your microphone is working and allowed.";
              } else if (event.error === 'not-allowed') {
                errorMessageText = "Microphone access denied. Please enable it in your browser settings.";
              } else if (event.error === 'network') {
                errorMessageText = "A network error occurred during speech recognition.";
              }
              toast({
                title: "Speech Error",
                description: errorMessageText,
                variant: "destructive",
              });
              setIsListening(false); 
              speechRecognitionRef.current = null; 
            };

            recognition.onend = () => {
              setIsListening(false);
            };
          }
          
          if (speechRecognitionRef.current && !isListening) {
            try {
              speechRecognitionRef.current.start();
            } catch (e: any) {
              console.error("Error trying to start recognition:", e.message);
              toast({
                title: "Mic Error",
                description: "Could not start microphone. Please try again.",
                variant: "destructive",
              });
              setIsListening(false);
              speechRecognitionRef.current = null; 
            }
          }
        })
        .catch(err => {
          console.error("Microphone permission error: ", err);
          let description = "Could not access microphone. Please grant permission.";
          if (err.name === "NotAllowedError") {
            description = "Microphone permission was denied. Please enable it in your browser settings.";
          } else if (err.name === "NotFoundError") {
            description = "No microphone was found. Please ensure one is connected and enabled.";
          }
          toast({
            title: "Microphone Error",
            description: description,
            variant: "destructive",
          });
          setIsListening(false);
          speechRecognitionRef.current = null; 
        });
    }
  };


  return (
    <Card className="w-full max-w-2xl h-[70vh] md:h-[80vh] shadow-2xl flex flex-col bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in-up animation-delay-400">
      <CardHeader className="p-4 border-b border-border/50 flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">CollegeGPT Chat</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleResetChat} 
            aria-label="Reset Chat"
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-1">
            <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            />
            <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>
      <CardFooter className="p-4 md:p-6 border-t border-border/50">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex items-center w-full gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className={`flex-shrink-0 ${isListening ? 'text-primary animate-pulse' : 'text-muted-foreground hover:text-primary'}`} 
            onClick={handleMicClick}
            disabled={isLoading} 
            aria-label={isListening ? "Stop listening" : "Use Microphone"}
            aria-pressed={isListening}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask CollegeGPT anything..."}
            className="flex-grow resize-none focus-visible:ring-1 focus-visible:ring-primary/80 bg-input/50 placeholder:text-muted-foreground/80"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isLoading || isListening} 
            aria-label="Chat input"
          />
          <Button 
            type="submit" 
            variant="default" 
            size="icon" 
            disabled={isLoading || isListening || !inputValue.trim()} 
            className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground" 
            aria-label="Send Message"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
