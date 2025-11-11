import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Target,
  Video,
  FileText,
  MessageSquare,
  Calendar,
  Brain,
  Zap,
  Star,
} from 'lucide-react';

interface StudentDashboardProps {
  onEnrollCourse: (courseId: string) => void;
}

export function StudentDashboard({ onEnrollCourse }: StudentDashboardProps) {
  const enrolledCourses = [
    {
      id: 'CS101',
      title: 'Introduction to Computer Science',
      instructor: 'Dr. James Miller',
      progress: 65,
      nextLesson: 'Week 3: Data Structures',
      dueAssignments: 2,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
      adaptiveLevel: 'intermediate',
      mastery: 78,
      timeSpent: 12.5,
    },
    {
      id: 'MATH201',
      title: 'Advanced Calculus',
      instructor: 'Prof. Sarah Chen',
      progress: 42,
      nextLesson: 'Week 2: Integration Techniques',
      dueAssignments: 1,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
      adaptiveLevel: 'challenging',
      mastery: 62,
      timeSpent: 8.3,
    },
    {
      id: 'PHYS301',
      title: 'Quantum Physics',
      instructor: 'Dr. Robert Brown',
      progress: 88,
      nextLesson: 'Week 5: Final Review',
      dueAssignments: 0,
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&q=80',
      adaptiveLevel: 'mastered',
      mastery: 91,
      timeSpent: 22.1,
    },
  ];

  const recommendedCourses = [
    {
      id: 'DS401',
      title: 'Data Science Fundamentals',
      instructor: 'Dr. Emily Wang',
      rating: 4.8,
      students: 1240,
      duration: '8 weeks',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
      aiReason: 'Based on your performance in CS101',
    },
    {
      id: 'ML501',
      title: 'Machine Learning Essentials',
      instructor: 'Prof. Michael Lee',
      rating: 4.9,
      students: 980,
      duration: '10 weeks',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=80',
      aiReason: 'Prerequisite mastery achieved',
    },
  ];

  const upcomingDeadlines = [
    {
      course: 'CS101',
      title: 'Binary Tree Implementation',
      type: 'Assignment',
      due: '2 days',
      priority: 'high',
    },
    {
      course: 'CS101',
      title: 'Quiz: Algorithm Complexity',
      type: 'Quiz',
      due: '4 days',
      priority: 'medium',
    },
    {
      course: 'MATH201',
      title: 'Integration Practice Set',
      type: 'Assignment',
      due: '1 week',
      priority: 'low',
    },
  ];

  const recentAchievements = [
    { title: 'Quick Learner', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Perfect Score', icon: Star, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Consistent Student', icon: Target, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'mastered':
        return 'bg-green-100 text-green-800';
      case 'challenging':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Courses</CardTitle>
            <BookOpen className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-white mb-1">3</div>
            <p className="text-xs text-indigo-100">65% avg completion</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Study Time</CardTitle>
            <Clock className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-white mb-1">42.9 hrs</div>
            <p className="text-xs text-purple-100">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Achievements</CardTitle>
            <Award className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-white mb-1">12</div>
            <p className="text-xs text-pink-100">+3 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Mastery</CardTitle>
            <TrendingUp className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-white mb-1">77%</div>
            <p className="text-xs text-green-100">+5% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Banner */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">AI Learning Insights</h3>
              <p className="text-sm text-indigo-100 mb-3">
                You're excelling in algorithmic thinking! Consider increasing difficulty in CS101 for optimal challenge. 
                We recommend reviewing integration fundamentals in MATH201 to improve mastery.
              </p>
              <Button size="sm" variant="secondary">
                View Personalized Path
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.instructor}</p>
                      </div>
                      <Badge className={getLevelColor(course.adaptiveLevel)}>
                        {course.adaptiveLevel}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Progress</p>
                        <p className="text-sm text-gray-900">{course.progress}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Mastery Score</p>
                        <p className="text-sm text-gray-900">{course.mastery}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time Spent</p>
                        <p className="text-sm text-gray-900">{course.timeSpent}h</p>
                      </div>
                    </div>

                    <Progress value={course.progress} className="mb-3" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {course.nextLesson}
                        </span>
                        {course.dueAssignments > 0 && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <FileText className="w-4 h-4" />
                            {course.dueAssignments} due
                          </span>
                        )}
                      </div>
                      <Button onClick={() => onEnrollCourse(course.id)}>
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <Card className="bg-white border-2 border-indigo-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <CardTitle>AI-Powered Recommendations</CardTitle>
              </div>
              <CardDescription>
                Courses selected based on your learning pattern and performance
              </CardDescription>
            </CardHeader>
          </Card>

          {recommendedCourses.map((course) => (
            <Card key={course.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.instructor}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-900">{course.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <span>{course.students.toLocaleString()} students</span>
                      <span>•</span>
                      <span>{course.duration}</span>
                      <span>•</span>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>

                    <div className="p-3 bg-indigo-50 rounded-lg mb-3">
                      <p className="text-sm text-indigo-900 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        {course.aiReason}
                      </p>
                    </div>

                    <Button variant="outline" className="w-full">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <CardTitle>Upcoming Deadlines</CardTitle>
              </div>
              <CardDescription>Stay on track with your assignments and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'Assignment' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {item.type === 'Assignment' ? (
                          <FileText className={`w-4 h-4 ${
                            item.type === 'Assignment' ? 'text-blue-600' : 'text-purple-600'
                          }`} />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.course} • {item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          item.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        Due in {item.due}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <CardTitle>Your Achievements</CardTitle>
              </div>
              <CardDescription>Badges earned through your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentAchievements.map((achievement, idx) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                    >
                      <div className={`p-4 ${achievement.bg} rounded-full mb-3`}>
                        <Icon className={`w-8 h-8 ${achievement.color}`} />
                      </div>
                      <h4 className="text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">Earned recently</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
