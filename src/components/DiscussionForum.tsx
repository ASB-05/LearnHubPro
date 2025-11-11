import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  MessageSquare,
  ThumbsUp,
  Award,
  Reply,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// ✅ define proper interfaces
interface ReplyItem {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isExpertAnswer?: boolean;
}

interface DiscussionItem {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  question: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: ReplyItem[]; // ✅ array, not number
  hasExpertAnswer: boolean;
  tags: string[];
}

interface DiscussionForumProps {
  courseId: string;
  lessonId: string;
}

export function DiscussionForum({ courseId, lessonId }: DiscussionForumProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [showReply, setShowReply] = useState<string | null>(null);

  // ✅ fixed replies and structure
  const discussions: DiscussionItem[] = [
    {
      id: "disc-1",
      author: "Michael Chen",
      authorRole: "student",
      avatar: "MC",
      question: "What's the difference between compiled and interpreted languages?",
      content:
        "I understand that both types exist, but I'm having trouble understanding the practical differences. Can someone explain with examples?",
      timestamp: "2 hours ago",
      likes: 12,
      hasExpertAnswer: true,
      tags: ["fundamentals", "languages"],
      replies: [
        {
          id: "reply-1",
          author: "Dr. James Miller",
          authorRole: "instructor",
          avatar: "JM",
          content:
            "Great question! Compiled languages (like C++) are translated to machine code before execution, making them faster. Interpreted languages (like Python) are translated line-by-line during execution, making them more flexible for development.",
          timestamp: "1 hour ago",
          likes: 8,
          isExpertAnswer: true,
        },
        {
          id: "reply-2",
          author: "Sarah Johnson",
          authorRole: "student",
          avatar: "SJ",
          content:
            "To add to that, think of compiled languages like having a fully translated book, while interpreted languages are like having a translator reading to you in real-time.",
          timestamp: "45 minutes ago",
          likes: 5,
        },
      ],
    },
    {
      id: "disc-2",
      author: "Emily Rodriguez",
      authorRole: "student",
      avatar: "ER",
      question: "Struggling with the concept of variables",
      content:
        "I watched the video but still don't fully understand how variables work in memory. Any additional resources?",
      timestamp: "5 hours ago",
      likes: 6,
      replies: [],
      hasExpertAnswer: false,
      tags: ["variables", "help-needed"],
    },
    {
      id: "disc-3",
      author: "David Kim",
      authorRole: "student",
      avatar: "DK",
      question: "Best practices for naming variables?",
      content:
        "Are there standard conventions we should follow when naming variables? I want to make sure I'm building good habits from the start.",
      timestamp: "1 day ago",
      likes: 15,
      replies: [],
      hasExpertAnswer: true,
      tags: ["best-practices", "coding-style"],
    },
  ];

  const handleLike = (id: string) => {
    console.log("Liked:", id);
  };

  const handleReply = (discussionId: string) => {
    console.log("Reply to:", discussionId, replyText[discussionId]);
    setReplyText({ ...replyText, [discussionId]: "" });
    setShowReply(null);
  };

  return (
    <div className="space-y-4">
      {/* New Question */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="What would you like to know about this lesson?"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            rows={4}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Be specific and clear to get the best answers
            </p>
            <Button onClick={() => setNewQuestion("")}>Post Question</Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter and Search */}
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search discussions..." className="pl-10" />
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="expert">Expert Answers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Discussions */}
      {discussions.map((discussion) => (
        <Card key={discussion.id} className="bg-white">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Question Header */}
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-indigo-100 text-indigo-700">
                    {discussion.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900">{discussion.author}</span>
                    {discussion.authorRole === "instructor" && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        Instructor
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {discussion.timestamp}
                    </span>
                  </div>
                  <h3 className="text-gray-900 mb-2">{discussion.question}</h3>
                  <p className="text-gray-700 text-sm mb-3">{discussion.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {discussion.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(discussion.id)}
                      className="text-gray-600 hover:text-indigo-600"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {discussion.likes}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowReply(
                          showReply === discussion.id ? null : discussion.id
                        )
                      }
                      className="text-gray-600 hover:text-indigo-600"
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Reply ({discussion.replies.length})
                    </Button>

                    {discussion.hasExpertAnswer && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Expert Answer
                      </Badge>
                    )}

                    <Button variant="ghost" size="sm" className="ml-auto">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {Array.isArray(discussion.replies) &&
                discussion.replies.length > 0 && (
                  <div className="ml-12 space-y-4 pt-4 border-t border-gray-100">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className={
                              reply.isExpertAnswer
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {reply.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-900">
                              {reply.author}
                            </span>
                            {reply.authorRole === "instructor" && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                Instructor
                              </Badge>
                            )}
                            {reply.isExpertAnswer && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                Expert
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              {reply.timestamp}
                            </span>
                          </div>
                          <p
                            className={`text-sm mb-2 ${
                              reply.isExpertAnswer
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {reply.content}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(reply.id)}
                            className="text-gray-600 hover:text-indigo-600 -ml-2"
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Reply Form */}
              {showReply === discussion.id && (
                <div className="ml-12 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-indigo-100 text-indigo-700">
                        SJ
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyText[discussion.id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [discussion.id]: e.target.value,
                          })
                        }
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleReply(discussion.id)}
                        >
                          Post Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowReply(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
