import ChatInterface from '@/components/campus-ai/chat-interface';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 selection:bg-primary/40 selection:text-primary-foreground">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary animate-fade-in-up">
          CollegeGPT
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2 animate-fade-in-up animation-delay-200">
          Your AI-Powered Guide to College Life
        </p>
      </div>
      <ChatInterface />
    </main>
  );
}

// Keyframes and animation utilities are defined in tailwind.config.ts and globals.css
// Example (already in tailwind.config.ts or globals.css):
/*
@layer utilities {
  .animation-delay-200 {
    animation-delay: 0.2s;
  }
  .animation-delay-400 {
    animation-delay: 0.4s;
  }
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }
}
*/
