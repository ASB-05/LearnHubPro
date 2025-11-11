import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Play,
  FileText,
  MessageSquare,
  CheckCircle,
  Lock,
  Clock,
  Brain,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { DiscussionForum } from './DiscussionForum';
import { AssignmentViewer } from './AssignmentViewer';

interface CourseViewerProps {
  courseId: string;
  onBack: () => void;
}

export function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const [activeLesson, setActiveLesson] = useState('lesson-1-1');
  const [showVideo, setShowVideo] = useState(false);

  const courseData = {
    id: courseId,
    title: 'Introduction to Computer Science',
    instructor: 'Dr. James Miller',
    progress: 65,
    mastery: 78,
  };

  const courseStructure = [
    {
      week: 'Week 1: Fundamentals',
      units: [
        {
          id: 'unit-1',
          title: 'Introduction to Programming',
          lessons: [
            {
              id: 'lesson-1-1',
              title: 'What is Programming?',
              type: 'video',
              duration: '15 min',
              completed: true,
              locked: false,
            },
            {
              id: 'lesson-1-2',
              title: 'Setting Up Your Environment',
              type: 'video',
              duration: '20 min',
              completed: true,
              locked: false,
            },
            {
              id: 'lesson-1-3',
              title: 'Your First Program',
              type: 'interactive',
              duration: '30 min',
              completed: true,
              locked: false,
            },
            {
              id: 'lesson-1-4',
              title: 'Quiz: Fundamentals Check',
              type: 'quiz',
              duration: '15 min',
              completed: true,
              locked: false,
              score: 95,
            },
          ],
        },
      ],
    },
    {
      week: 'Week 2: Variables & Data Types',
      units: [
        {
          id: 'unit-2',
          title: 'Understanding Data',
          lessons: [
            {
              id: 'lesson-2-1',
              title: 'Variables Explained',
              type: 'video',
              duration: '18 min',
              completed: true,
              locked: false,
            },
            {
              id: 'lesson-2-2',
              title: 'Primitive Data Types',
              type: 'video',
              duration: '22 min',
              completed: true,
              locked: false,
            },
            {
              id: 'lesson-2-3',
              title: 'Practice: Variable Declaration',
              type: 'assignment',
              duration: '45 min',
              completed: false,
              locked: false,
              dueDate: '2 days',
            },
          ],
        },
      ],
    },
    {
      week: 'Week 3: Data Structures',
      units: [
        {
          id: 'unit-3',
          title: 'Arrays and Lists',
          lessons: [
            {
              id: 'lesson-3-1',
              title: 'Introduction to Arrays',
              type: 'video',
              duration: '25 min',
              completed: false,
              locked: false,
            },
            {
              id: 'lesson-3-2',
              title: 'Working with Lists',
              type: 'video',
              duration: '20 min',
              completed: false,
              locked: false,
            },
            {
              id: 'lesson-3-3',
              title: 'Binary Trees Fundamentals',
              type: 'video',
              duration: '30 min',
              completed: false,
              locked: false,
            },
            {
              id: 'lesson-3-4',
              title: 'Advanced Tree Operations',
              type: 'video',
              duration: '35 min',
              completed: false,
              locked: true,
              prerequisite: 'Complete lesson 3-3 with 80% mastery',
            },
          ],
        },
      ],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      case 'assignment':
        return <FileText className="w-4 h-4" />;
      case 'interactive':
        return <Brain className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-purple-100 text-purple-800';
      case 'assignment':
        return 'bg-green-100 text-green-800';
      case 'interactive':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showVideo) {
    return <VideoPlayer lessonId={activeLesson} onBack={() => setShowVideo(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-gray-900 mb-2">{courseData.title}</h1>
                  <p className="text-gray-600">{courseData.instructor}</p>
                </div>
                <Badge className="bg-indigo-100 text-indigo-800">
                  {courseData.mastery}% Mastery
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="text-gray-900">{courseData.progress}%</span>
                </div>
                <Progress value={courseData.progress} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Adaptive Insight */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white mb-2">Adaptive Learning Recommendation</h3>
                <p className="text-sm text-purple-100">
                  You're performing exceptionally well! We've unlocked advanced materials in Week 3. 
                  Consider reviewing arrays before moving to trees for optimal retention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Structure Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-24">
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {courseStructure.map((week, weekIdx) => (
                    <div key={weekIdx}>
                      <h3 className="text-sm text-gray-900 mb-2">{week.week}</h3>
                      {week.units.map((unit) => (
                        <div key={unit.id} className="space-y-1 mb-3">
                          <p className="text-xs text-gray-600 mb-2">{unit.title}</p>
                          {unit.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => !lesson.locked && setActiveLesson(lesson.id)}
                              disabled={lesson.locked}
                              className={`w-full text-left p-2 rounded-lg transition-colors ${
                                activeLesson === lesson.id
                                  ? 'bg-indigo-100 border border-indigo-300'
                                  : lesson.locked
                                  ? 'bg-gray-50 cursor-not-allowed'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {lesson.locked ? (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                ) : lesson.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                )}
                                <span
                                  className={`text-sm flex-1 ${
                                    lesson.locked ? 'text-gray-400' : 'text-gray-900'
                                  }`}
                                >
                                  {lesson.title}
                                </span>
                                <Badge className={`${getTypeColor(lesson.type)} text-xs`}>
                                  {lesson.type}
                                </Badge>
                              </div>
                              {lesson.locked && lesson.prerequisite && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">
                                  {lesson.prerequisite}
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="lesson" className="space-y-4">
              <TabsList className="bg-white">
                <TabsTrigger value="lesson">Lesson</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="lesson">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>What is Programming?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group">
                      <img
                        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"
                        alt="Lesson"
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          onClick={() => setShowVideo(true)}
                          className="bg-white text-gray-900 hover:bg-gray-100 rounded-full w-16 h-16 p-0"
                        >
                          <Play className="w-8 h-8" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                        15:30
                      </div>
                    </div>

                    {/* Lesson Info */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>15 minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Completed</span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Score: 95%</Badge>
                    </div>

                    {/* Lesson Description */}
                    <div>
                      <h3 className="text-gray-900 mb-3">About this Lesson</h3>
                      <p className="text-gray-600 mb-4">
                        In this introductory lesson, you'll learn the fundamental concepts of programming, 
                        including what programming is, why it's important, and how computers execute instructions. 
                        We'll explore real-world applications and set the foundation for your coding journey.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Fundamentals</Badge>
                        <Badge variant="outline">Introduction</Badge>
                        <Badge variant="outline">Theory</Badge>
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div>
                      <h3 className="text-gray-900 mb-3">Learning Objectives</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Understand the basic definition and purpose of programming</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Identify different programming paradigms</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Recognize real-world applications of programming</span>
                        </li>
                      </ul>
                    </div>

                    {/* Next Lesson */}
                    <div className="pt-4 border-t border-gray-200">
                      <Button className="w-full justify-between">
                        <span>Next: Setting Up Your Environment</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion">
                <DiscussionForum courseId={courseId} lessonId={activeLesson} />
              </TabsContent>

              <TabsContent value="assignments">
                <AssignmentViewer courseId={courseId} />
              </TabsContent>

              <TabsContent value="resources">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Additional Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <h4 className="text-sm text-gray-900">Lecture Slides</h4>
                            <p className="text-xs text-gray-600">Week 1 - Introduction.pdf</p>
                          </div>
                          <Badge variant="outline">PDF</Badge>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-green-600" />
                          <div className="flex-1">
                            <h4 className="text-sm text-gray-900">Recommended Reading</h4>
                            <p className="text-xs text-gray-600">Chapter 1: Computing Fundamentals</p>
                          </div>
                          <Badge variant="outline">Article</Badge>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Brain className="w-5 h-5 text-purple-600" />
                          <div className="flex-1">
                            <h4 className="text-sm text-gray-900">Interactive Code Playground</h4>
                            <p className="text-xs text-gray-600">Practice writing your first program</p>
                          </div>
                          <Badge variant="outline">Interactive</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
