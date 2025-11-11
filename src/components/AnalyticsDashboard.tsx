import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

export function AnalyticsDashboard() {
  // Revenue and Fees Data
  const revenueData = [
    { month: 'Jul', revenue: 35000, fees: 980 },
    { month: 'Aug', revenue: 38000, fees: 1050 },
    { month: 'Sep', revenue: 42000, fees: 1150 },
    { month: 'Oct', revenue: 40000, fees: 1100 },
    { month: 'Nov', revenue: 43000, fees: 1180 },
    { month: 'Dec', revenue: 45000, fees: 1235 },
    { month: 'Jan', revenue: 47000, fees: 1290 },
  ];

  // Refund Trends Data
  const refundData = [
    { month: 'Jul', refunds: 2500, count: 12 },
    { month: 'Aug', refunds: 1800, count: 8 },
    { month: 'Sep', refunds: 3200, count: 15 },
    { month: 'Oct', refunds: 2100, count: 10 },
    { month: 'Nov', refunds: 2800, count: 13 },
    { month: 'Dec', refunds: 1900, count: 9 },
    { month: 'Jan', refunds: 2400, count: 11 },
  ];

  // Payment Method Distribution
  const paymentMethodData = [
    { name: 'Credit Card', value: 58, amount: 27260 },
    { name: 'ACH', value: 28, amount: 13160 },
    { name: 'Wallet', value: 14, amount: 6580 },
  ];

  // Refund Reasons
  const refundReasonData = [
    { reason: 'Billing Error', count: 18, percentage: 35 },
    { reason: 'Insurance Adjustment', count: 15, percentage: 29 },
    { reason: 'Service Cancelled', count: 10, percentage: 20 },
    { reason: 'Overcharge', count: 5, percentage: 10 },
    { reason: 'Other', count: 3, percentage: 6 },
  ];

  // Processing Fee by Gateway
  const feeByGatewayData = [
    { gateway: 'Stripe', transactions: 1250, fees: 725.50, avgFee: 0.58 },
    { gateway: 'Square', transactions: 850, fees: 510.25, avgFee: 0.60 },
    { gateway: 'PayPal', transactions: 450, fees: 290.75, avgFee: 0.65 },
    { gateway: 'ACH Direct', transactions: 320, fees: 96.00, avgFee: 0.30 },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Refunds (30d)</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">$12,450</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <span className="text-green-600">-8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Refund Rate</CardTitle>
            <Percent className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">2.8%</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <span className="text-green-600">-0.4%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Processing Fee</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">$4.52</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <span className="text-red-600">+0.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Fee Recovery Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">98.5%</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <span className="text-green-600">+1.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="revenue">Revenue & Fees</TabsTrigger>
          <TabsTrigger value="refunds">Refund Trends</TabsTrigger>
          <TabsTrigger value="distribution">Payment Methods</TabsTrigger>
          <TabsTrigger value="reasons">Refund Reasons</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Revenue & Processing Fees Trend</CardTitle>
              <CardDescription>Monthly revenue and processing fee collection over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
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
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    type="monotone"
                    dataKey="fees"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Processing Fees ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Refund Trends</CardTitle>
              <CardDescription>Refund amounts and frequency over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={refundData}>
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
                  <Bar dataKey="refunds" fill="#ef4444" name="Refund Amount ($)" />
                  <Bar dataKey="count" fill="#f59e0b" name="Number of Refunds" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
                <CardDescription>Breakdown by transaction volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Processing Fees by Gateway</CardTitle>
                <CardDescription>Fee comparison across payment processors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeByGatewayData.map((gateway, index) => (
                    <div key={gateway.gateway} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{gateway.gateway}</span>
                        <span className="text-sm text-gray-600">${gateway.fees.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(gateway.fees / 725.5) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-20 text-right">
                          {gateway.transactions} txns
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Avg fee per transaction: ${gateway.avgFee.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reasons">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Refund Reasons Analysis</CardTitle>
              <CardDescription>Common causes for refund requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={refundReasonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="reason" type="category" stroke="#6b7280" width={150} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" name="Number of Refunds" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {refundReasonData.map((reason, index) => (
                    <div
                      key={reason.reason}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm text-gray-900">{reason.reason}</h4>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                      </div>
                      <p className="text-gray-900 mb-1">{reason.count} requests</p>
                      <p className="text-sm text-gray-600">{reason.percentage}% of total</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card className="bg-white border-2 border-indigo-200">
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">Refund rate decreased by 8.2% this month</p>
                <p className="text-xs text-gray-600">
                  Improved billing accuracy and better insurance verification process
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">ACH payments save 63% in processing fees</p>
                <p className="text-xs text-gray-600">
                  Consider incentivizing ACH payments to reduce overall processing costs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">35% of refunds are due to billing errors</p>
                <p className="text-xs text-gray-600">
                  Implement additional validation in the billing workflow to reduce errors
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
