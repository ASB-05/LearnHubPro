import React, { useState, useEffect, useRef } from 'react';
import { User } from '../App'; // Import User type
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageSquare, X, Loader2 } from 'lucide-react';

interface ChatWidgetProps {
  user: User;
}

interface Message {
  _id: string;
  username: string;
  role: string;
  text: string;
  timestamp: string;
}

export default function ChatWidget({ user }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Use a ref to hold the WebSocket connection
  const ws = useRef<WebSocket | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Effect to fetch history on widget open
  useEffect(() => {
    if (isOpen) {
      setLoadingHistory(true);
      // 1. Fetch chat history
      fetch('http://localhost:5000/api/chat/history')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMessages(data.messages);
          }
        })
        .catch(err => console.error("Failed to fetch chat history:", err))
        .finally(() => setLoadingHistory(false));

      // 2. Establish WebSocket connection
      // Connect to the ws server running on the same port
      ws.current = new WebSocket('ws://localhost:5000'); 

      ws.current.onopen = () => {
        console.log('Chat WebSocket connected.');
      };

      // 3. Listen for new messages
      ws.current.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        if (messageData.type === 'newChatMessage') {
          setMessages(prevMessages => [...prevMessages, messageData.payload]);
        }
      };

      ws.current.onclose = () => {
        console.log('Chat WebSocket disconnected.');
      };

      ws.current.onerror = (err) => {
        console.error('Chat WebSocket error:', err);
      };

      // 4. Cleanup on close
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [isOpen]); // Re-run effect when isOpen changes

  // Effect to auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div:first-child');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // Send message *to* the WebSocket server
    const messagePayload = {
      type: 'chatMessage',
      payload: {
        username: user.username,
        role: user.role,
        text: newMessage.trim(),
      }
    };
    
    ws.current.send(JSON.stringify(messagePayload));
    setNewMessage('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-pink-600';
      case 'instructor': return 'text-purple-600';
      case 'student': return 'text-indigo-600';
      default: return 'text-gray-700';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110"
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-8 right-8 w-80 h-96 shadow-xl rounded-lg flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <CardTitle className="text-lg">LearnHub Chat</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {loadingHistory ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg._id} className="text-sm">
                  <span className={`font-bold ${getRoleColor(msg.role)}`}>
                    {msg.username}
                  </span>: <span>{msg.text}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}