"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { maintainContextConversation, type MaintainContextConversationInput } from "@/ai/flows/maintain-context-conversation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ConversationHistory = MaintainContextConversationInput['conversationHistory'];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sarcasticMode, setSarcasticMode] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory>([]);
  const { toast } = useToast();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const { response, updatedConversationHistory } = await maintainContextConversation({
        userInput: currentInput,
        conversationHistory,
        sarcasticMode,
      });

      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      setConversationHistory(updatedConversationHistory);
    } catch (error) {
      console.error("Error calling AI:", error);
      const errorMessage: Message = { role: "assistant", content: "My circuits are buzzing with errors. I couldn't process that. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with the AI response.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl">Mocktopus</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="sarcastic-mode" className="text-sm font-medium">Sarcastic Mode</Label>
          <Switch
            id="sarcastic-mode"
            checked={sarcasticMode}
            onCheckedChange={setSarcasticMode}
            disabled={isLoading}
            aria-label="Toggle sarcastic mode"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground pt-10 px-4">
                <h2 className="text-lg font-semibold text-foreground">Welcome!</h2>
                <p className="mt-2">Start a conversation by typing below. You can ask questions, give commands, or even paste code snippets.</p>
                <p className="mt-1 text-xs">Toggle "Sarcastic Mode" for a different flavor of response.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <ChatMessage message={{ role: "assistant", content: "" }} isLoading />
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="flex-1"
            aria-label="Chat input"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon" aria-label="Send message">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
