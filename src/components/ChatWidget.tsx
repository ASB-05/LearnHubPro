// src/components/ChatWidget.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button"; //
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"; //
import { Input } from "./ui/input"; //
import { ScrollArea } from "./ui/scroll-area"; //
import { MessageCircle, X, Send } from "lucide-react";

// Define the shape of a message
interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Welcome to your virtual assistant! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage: ChatMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // ** THIS IS WHERE YOU WOULD CALL YOUR BACKEND API **
    // For now, we'll just simulate a bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        sender: "bot",
        text: `You said: "${input}". I am a demo bot. A real AI response would go here.`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Bubble Trigger */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="chat-widget-trigger"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="chat-window">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Virtual Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[350px] p-4" ref={scrollAreaRef}>
              <div className="flex flex-col space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span
                      className={`p-2 rounded-lg max-w-[80%] ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;