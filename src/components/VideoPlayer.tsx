import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  MessageSquare,
  BookmarkPlus,
  CheckCircle,
  X,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface VideoPlayerProps {
  lessonId: string;
  onBack: () => void;
}

export function VideoPlayer({ lessonId, onBack }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0');
  const [currentTime, setCurrentTime] = useState(245); // 4:05
  const [duration] = useState(930); // 15:30
  const [showQuiz, setShowQuiz] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');

  const notes = [
    { timestamp: '2:15', text: 'Programming is a way to communicate with computers' },
    { timestamp: '5:30', text: 'Key concepts: variables, functions, loops' },
  ];

  const quizQuestion = {
    question: 'What is the primary purpose of a programming language?',
    options: [
      'To make computers faster',
      'To communicate instructions to a computer',
      'To design user interfaces',
      'To store data',
    ],
    correct: 1,
  };

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addNote = () => {
    if (noteText.trim()) {
      console.log('Adding note:', noteText, 'at', formatTime(currentTime));
      setNoteText('');
    }
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    if (selectedAnswer === quizQuestion.correct) {
      setTimeout(() => {
        setShowQuiz(false);
        setIsPlaying(true);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative">
        {/* Video Content */}
        <div className="aspect-video bg-gray-900 relative">
          <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80"
            alt="Video"
            className="w-full h-full object-cover opacity-70"
          />

          {/* In-Video Quiz Overlay */}
          {showQuiz && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl bg-white">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-gray-900 mb-4">{quizQuestion.question}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuiz(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {quizQuestion.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => !quizSubmitted && setSelectedAnswer(idx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                            quizSubmitted
                              ? idx === quizQuestion.correct
                                ? 'border-green-500 bg-green-50'
                                : idx === selectedAnswer
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 bg-gray-50'
                              : selectedAnswer === idx
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900">{option}</span>
                            {quizSubmitted && idx === quizQuestion.correct && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    {!quizSubmitted ? (
                      <Button
                        onClick={submitQuiz}
                        disabled={selectedAnswer === null}
                        className="w-full"
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <div
                        className={`p-4 rounded-lg ${
                          selectedAnswer === quizQuestion.correct
                            ? 'bg-green-50 text-green-900'
                            : 'bg-red-50 text-red-900'
                        }`}
                      >
                        {selectedAnswer === quizQuestion.correct
                          ? '✓ Correct! Great job. Continuing video...'
                          : '✗ Incorrect. The correct answer is highlighted above.'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Play/Pause Overlay */}
          {!isPlaying && !showQuiz && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                onClick={() => setIsPlaying(true)}
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-full w-20 h-20 p-0"
              >
                <Play className="w-10 h-10" />
              </Button>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[(currentTime / duration) * 100]}
                onValueChange={(value) => setCurrentTime((value[0] / 100) * duration)}
                max={100}
                step={0.1}
                className="cursor-pointer"
              />
              <div className="flex items-center justify-between mt-1 text-xs text-white">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
                  <SelectTrigger className="w-20 h-8 bg-transparent border-white/20 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1.0">1.0x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2.0">2.0x</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-white hover:bg-white/20"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowQuiz(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button variant="outline" onClick={onBack} className="mb-6 bg-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Info */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h2 className="text-gray-900 mb-2">What is Programming?</h2>
                <p className="text-gray-600 mb-4">
                  Learn the fundamental concepts of programming and how computers execute instructions.
                </p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                  <Badge variant="outline">15:30 duration</Badge>
                  <Badge variant="outline">Beginner Level</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Transcript or Additional Content */}
            <Card className="bg-white mt-6">
              <CardContent className="pt-6">
                <h3 className="text-gray-900 mb-4">Video Transcript</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <span className="text-gray-400 mr-2">0:00</span>
                    Welcome to Introduction to Computer Science. Today we'll explore what programming really means...
                  </p>
                  <p>
                    <span className="text-gray-400 mr-2">0:30</span>
                    Programming is essentially a way for humans to communicate with computers...
                  </p>
                  <p>
                    <span className="text-gray-400 mr-2">1:15</span>
                    Think of it as learning a new language, but instead of talking to people...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Sidebar */}
          <div>
            <Card className="bg-white sticky top-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900">Your Notes</h3>
                  <Badge variant="outline">{notes.length} notes</Badge>
                </div>

                {/* Add Note */}
                <div className="space-y-2 mb-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-indigo-900">
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Add note at {formatTime(currentTime)}</span>
                  </div>
                  <Textarea
                    placeholder="Type your note here..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                  />
                  <Button size="sm" onClick={addNote} className="w-full">
                    Save Note
                  </Button>
                </div>

                {/* Notes List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {note.timestamp}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700">{note.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
