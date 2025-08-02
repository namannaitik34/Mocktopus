"use client";

import ChatInterface from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-2 sm:p-4 md:p-12">
      <ChatInterface />
    </main>
  );
}


