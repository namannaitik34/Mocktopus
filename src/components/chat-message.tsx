"use client";

import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const LoadingDots = () => (
  <div className="flex items-center space-x-1">
    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
  </div>
);

const MarkdownContent = ({ content }: { content: string }) => {
  const parts = content.split(/(```[\s\S]*?```)/g).filter(Boolean);

  return (
    <div className="text-sm">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).trim();
          return (
            <pre key={i} className="my-2 whitespace-pre-wrap rounded-md bg-secondary p-4 font-code text-secondary-foreground overflow-x-auto">
              <code>{code}</code>
            </pre>
          );
        }
        return (
          <div key={i} className="whitespace-pre-wrap">
            {part}
          </div>
        );
      })}
    </div>
  );
};

export function ChatMessage({ message, isLoading }: { message: Message; isLoading?: boolean }) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        !isAssistant && "justify-end"
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xl rounded-lg px-4 py-2 shadow-sm",
          isAssistant
            ? "bg-card text-card-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {isLoading ? <LoadingDots /> : <MarkdownContent content={message.content} />}
      </div>
      {!isAssistant && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
