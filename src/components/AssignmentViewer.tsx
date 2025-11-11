import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import {
  FileText,
  Upload,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Code,
  File,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AssignmentViewerProps {
  courseId: string;
}

export function AssignmentViewer({ courseId }: AssignmentViewerProps) {
  const [submissionText, setSubmissionText] = useState('');

  const assignments = [
    {
      id: 'asgn-1',
      title: 'Binary Tree Implementation',
      description:
        'Implement a binary search tree with insert, search, and delete operations. Include proper error handling and edge cases.',
      type: 'code',
      dueDate: '2024-01-20',
      daysLeft: 2,
      points: 100,
      status: 'pending',
      submitted: false,
      rubric: [
        { criterion: 'Correctness', points: 40, description: 'Code produces correct results' },
        { criterion: 'Code Quality', points: 30, description: 'Clean, readable, well-documented' },
        { criterion: 'Edge Cases', points: 20, description: 'Handles all edge cases properly' },
        { criterion: 'Efficiency', points: 10, description: 'Uses optimal algorithms' },
      ],
    },
    {
      id: 'asgn-2',
      title: 'Quiz: Algorithm Complexity',
      description: 'Answer questions about Big O notation and algorithm analysis.',
      type: 'quiz',
      dueDate: '2024-01-22',
      daysLeft: 4,
      points: 50,
      status: 'not_started',
      submitted: false,
      questions: 15,
      timeLimit: 45,
    },
    {
      id: 'asgn-3',
      title: 'Variables Practice Set',
      description: 'Complete the exercises on variable declaration and data types.',
      type: 'text',
      dueDate: '2024-01-18',
      daysLeft: -1,
      points: 75,
      status: 'graded',
      submitted: true,
      score: 68,
      feedback: 'Good understanding of basics. Review pointer arithmetic section.',
      peerReviews: 3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Code className="w-5 h-5" />;
      case 'quiz':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="bg-white">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    assignment.type === 'code'
                      ? 'bg-blue-100'
                      : assignment.type === 'quiz'
                      ? 'bg-purple-100'
                      : 'bg-green-100'
                  }`}>
                    {getTypeIcon(assignment.type)}
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {assignment.type.toUpperCase()}
                      </Badge>
                      {assignment.type === 'quiz' && (
                        <>
                          <Badge variant="outline">
                            {assignment.questions} questions
                          </Badge>
                          <Badge variant="outline">
                            {assignment.timeLimit} min
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 mb-1">{assignment.points} points</p>
                  {assignment.status === 'graded' && assignment.score !== undefined && (
                    <p className="text-sm text-green-600">
                      Score: {assignment.score}/{assignment.points}
                    </p>
                  )}
                </div>
              </div>

              {/* Due Date Alert */}
              {assignment.daysLeft >= 0 && assignment.status !== 'graded' && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    assignment.daysLeft <= 2
                      ? 'bg-red-50 text-red-900'
                      : 'bg-blue-50 text-blue-900'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Due in {assignment.daysLeft} day{assignment.daysLeft !== 1 ? 's' : ''} - {assignment.dueDate}
                  </span>
                </div>
              )}

              {assignment.daysLeft < 0 && assignment.status === 'graded' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-900">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Graded - Submitted on time</span>
                </div>
              )}

              {/* Rubric */}
              {assignment.rubric && assignment.status !== 'graded' && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm text-gray-900 mb-3">Grading Rubric</h4>
                  <div className="space-y-2">
                    {assignment.rubric.map((criterion, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <p className="text-gray-900">{criterion.criterion}</p>
                          <p className="text-xs text-gray-600">{criterion.description}</p>
                        </div>
                        <span className="text-gray-900 ml-4">{criterion.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback (for graded assignments) */}
              {assignment.status === 'graded' && assignment.feedback && (
                <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4">
                  <h4 className="text-sm text-indigo-900 mb-2">Instructor Feedback</h4>
                  <p className="text-sm text-indigo-800">{assignment.feedback}</p>
                  {assignment.score !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-indigo-900">Your Score</span>
                        <span className="text-indigo-900">
                          {assignment.score}/{assignment.points}
                        </span>
                      </div>
                      <Progress
                        value={(assignment.score / assignment.points) * 100}
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Peer Review Status */}
              {assignment.peerReviews && assignment.peerReviews > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Completed {assignment.peerReviews} peer reviews</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                {assignment.status === 'pending' || assignment.status === 'not_started' ? (
                  <>
                    <Button className="flex-1">
                      {assignment.type === 'quiz' ? 'Start Quiz' : 'Submit Assignment'}
                    </Button>
                    <Button variant="outline">View Details</Button>
                  </>
                ) : assignment.status === 'graded' ? (
                  <>
                    <Button variant="outline" className="flex-1">
                      View Submission
                    </Button>
                    <Button variant="outline">Download Feedback</Button>
                  </>
                ) : (
                  <Button variant="outline" className="flex-1">
                    View Submission
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Assignment Submission Modal (Simplified) */}
      <Card className="bg-white border-2 border-indigo-200">
        <CardHeader>
          <CardTitle>Submit Assignment</CardTitle>
          <CardDescription>Upload your completed work</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="file">
            <TabsList className="mb-4">
              <TabsTrigger value="file">File Upload</TabsTrigger>
              <TabsTrigger value="text">Text Submission</TabsTrigger>
              <TabsTrigger value="code">Code Repository</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, ZIP files up to 50MB
                </p>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="Type or paste your submission here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={10}
              />
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Branch Name</label>
                <input
                  type="text"
                  placeholder="main"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="pledge" className="rounded" />
            <label htmlFor="pledge" className="text-sm text-gray-600">
              I pledge that this is my original work
            </label>
          </div>

          <div className="flex gap-2 mt-4">
            <Button className="flex-1">Submit Assignment</Button>
            <Button variant="outline">Save Draft</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
