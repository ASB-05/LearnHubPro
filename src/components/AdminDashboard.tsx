import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Users,
  BookOpen,
  TrendingUp,
  Server,
  Shield,
  Activity,
  UserCheck,
  Settings,
  Database,
  Zap,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function AdminDashboard() {
  const platformStats = {
    totalUsers: 12458,
    activeUsers: 8234,
    totalCourses: 342,
    activeCourses: 289,
    totalInstructors: 87,
    totalStudents: 12371,
    concurrentUsers: 2456,
    systemUptime: 99.97,
  };

  const usageData = [
    { month: 'Jul', users: 8500, courses: 280, engagement: 75 },
    { month: 'Aug', users: 9200, courses: 295, engagement: 78 },
    { month: 'Sep', users: 10100, courses: 310, engagement: 80 },
    { month: 'Oct', users: 10800, courses: 325, engagement: 82 },
    { month: 'Nov', users: 11500, courses: 335, engagement: 81 },
    { month: 'Dec', users: 12100, courses: 342, engagement: 79 },
    { month: 'Jan', users: 12458, courses: 342, engagement: 83 },
  ];

  const courseDistribution = [
    { category: 'Computer Science', count: 89, color: '#6366f1' },
    { category: 'Mathematics', count: 67, color: '#8b5cf6' },
    { category: 'Engineering', count: 54, color: '#ec4899' },
    { category: 'Business', count: 48, color: '#10b981' },
    { category: 'Arts & Humanities', count: 42, color: '#f59e0b' },
    { category: 'Others', count: 42, color: '#6b7280' },
  ];

  const systemMetrics = [
    { metric: 'API Response Time', value: '145ms', status: 'good', target: '< 200ms' },
    { metric: 'Database Queries', value: '342/sec', status: 'good', target: '< 500/sec' },
    { metric: 'Page Load Time', value: '0.8s', status: 'excellent', target: '< 1s' },
    { metric: 'Error Rate', value: '0.02%', status: 'excellent', target: '< 0.1%' },
    { metric: 'Concurrent Users', value: '2,456', status: 'good', target: '< 10,000' },
    { metric: 'Storage Used', value: '68%', status: 'warning', target: '< 80%' },
  ];

  const pendingApprovals = [
    {
      type: 'Course',
      title: 'Advanced Machine Learning',
      instructor: 'Dr. Emily Wang',
      submitted: '2 days ago',
    },
    {
      type: 'Course',
      title: 'Blockchain Fundamentals',
      instructor: 'Prof. Michael Lee',
      submitted: '1 day ago',
    },
    {
      type: 'User',
      title: 'Instructor Application',
      instructor: 'Sarah Martinez',
      submitted: '5 hours ago',
    },
  ];

  const recentActivity = [
    { action: 'New course published', user: 'Dr. James Miller', time: '5 min ago' },
    { action: 'User role updated', user: 'Admin Sarah', time: '12 min ago' },
    { action: 'System backup completed', user: 'System', time: '1 hour ago' },
    { action: 'Bulk user import', user: 'Admin John', time: '2 hours ago' },
    { action: 'Analytics report generated', user: 'System', time: '3 hours ago' },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6b7280'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-white mb-1">
              {platformStats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-indigo-100">
              {platformStats.activeUsers.toLocaleString()} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Courses</CardTitle>
            <BookOpen className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-white mb-1">{platformStats.totalCourses}</div>
            <p className="text-xs text-purple-100">
              {platformStats.activeCourses} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Concurrent Users</CardTitle>
            <Activity className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-white mb-1">
              {platformStats.concurrentUsers.toLocaleString()}
            </div>
            <p className="text-xs text-pink-100">Real-time active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">System Uptime</CardTitle>
            <Server className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-white mb-1">{platformStats.systemUptime}%</div>
            <p className="text-xs text-green-100">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="courses">Course Approval</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Platform Growth */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
              <CardDescription>User and course growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={usageData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    name="Total Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="courses"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorCourses)"
                    name="Total Courses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Course Distribution */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Course Distribution</CardTitle>
                <CardDescription>Courses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={courseDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {courseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-900 mb-2">
                  {platformStats.totalStudents.toLocaleString()}
                </div>
                <Progress value={85} className="mb-2" />
                <p className="text-sm text-gray-600">85% active this month</p>
                <Button variant="outline" className="w-full mt-4">
                  Manage Students
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-900 mb-2">
                  {platformStats.totalInstructors}
                </div>
                <Progress value={92} className="mb-2" />
                <p className="text-sm text-gray-600">92% active this month</p>
                <Button variant="outline" className="w-full mt-4">
                  Manage Instructors
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-900 mb-2">3</div>
                <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                  Requires attention
                </Badge>
                <p className="text-sm text-gray-600 mb-4">New user applications</p>
                <Button className="w-full">Review Applications</Button>
              </CardContent>
            </Card>
          </div>

          {/* User Actions */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>User Management Actions</CardTitle>
              <CardDescription>Bulk operations and user management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Bulk Import Users
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Roles & Permissions
                </Button>
                <Button variant="outline" className="justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  View Activity Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Pending Course Approvals</CardTitle>
              <CardDescription>
                Review and approve new courses before publication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingApprovals
                  .filter((item) => item.type === 'Course')
                  .map((course, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-gray-900 mb-1">{course.title}</h4>
                          <p className="text-sm text-gray-600">by {course.instructor}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Pending Review
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Submitted {course.submitted}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Review Content
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Templates */}
          <Card className="bg-white border-2 border-indigo-200">
            <CardHeader>
              <CardTitle>Course Templates</CardTitle>
              <CardDescription>
                Pre-configured templates for rapid course deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="outline">Computer Science Template</Button>
                <Button variant="outline">Mathematics Template</Button>
                <Button variant="outline">Business Template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          {/* System Metrics */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>System Performance Metrics</CardTitle>
              <CardDescription>Real-time system health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm text-gray-900">{metric.metric}</h4>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                    <p className="text-gray-900 mb-1">{metric.value}</p>
                    <p className="text-xs text-gray-600">Target: {metric.target}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  Run Backup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  View Query Logs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Audit
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  SCORM Compliance Check
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <Card className="bg-white border-2 border-yellow-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <CardTitle>System Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2" />
                  <div>
                    <p className="text-sm text-gray-900">Storage at 68% capacity</p>
                    <p className="text-xs text-gray-600">Consider expanding storage soon</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                  <div>
                    <p className="text-sm text-gray-900">All systems operational</p>
                    <p className="text-xs text-gray-600">99.97% uptime maintained</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm text-gray-900 mb-1">SCORM Compliance</h4>
                    <p className="text-xs text-gray-600">Enable SCORM 1.2 and 2004 support</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm text-gray-900 mb-1">API Integrations</h4>
                    <p className="text-xs text-gray-600">Manage external API connections</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm text-gray-900 mb-1">Email Notifications</h4>
                    <p className="text-xs text-gray-600">
                      Configure automated email templates
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit Templates
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm text-gray-900 mb-1">Accessibility Features</h4>
                    <p className="text-xs text-gray-600">
                      Screen reader support and closed captions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
