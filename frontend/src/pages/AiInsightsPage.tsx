import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Brain, TrendingUp, Smile, Target, Lightbulb } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatTile, Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { sentimentDistribution, churnRiskDistribution, customerGrowth, recommendations } from '@/mock/data'
import { formatNumber } from '@/lib/utils'

const customerHealthRadar = [
  { metric: 'Engagement', score: 78 },
  { metric: 'Sentiment', score: 64 },
  { metric: 'Retention', score: 72 },
  { metric: 'Value', score: 85 },
  { metric: 'Loyalty', score: 80 },
  { metric: 'Advocacy', score: 56 },
]

const aiReplyVolume = [
  { day: 'Mon', sent: 42 },
  { day: 'Tue', sent: 56 },
  { day: 'Wed', sent: 71 },
  { day: 'Thu', sent: 58 },
  { day: 'Fri', sent: 82 },
  { day: 'Sat', sent: 23 },
  { day: 'Sun', sent: 18 },
]

const sentimentEmotion = [
  { name: 'Satisfied', value: 38 },
  { name: 'Neutral', value: 24 },
  { name: 'Frustrated', value: 18 },
  { name: 'Interested', value: 12 },
  { name: 'Urgent', value: 5 },
  { name: 'Confused', value: 3 },
]

const COLORS = ['#10b981', '#94a3b8', '#ef4444', '#3b82f6', '#f59e0b', '#a855f7']

export function AiInsightsPage() {
  const successRate = 78
  const replyCount = recommendations.length * 14

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        description="Understand what your AI engine sees across all customer interactions"
        action={
          <Link to="/next-best-action" className="btn-primary">
            <Target className="h-4 w-4" /> View recommendations
          </Link>
        }
      />

      <Card className="overflow-hidden bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 text-white">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5" /> AI Engine v2.4 • Running
            </div>
            <h2 className="mt-3 text-2xl font-semibold">Customer Intelligence at a glance</h2>
            <p className="mt-1 max-w-xl text-sm text-white/80">
              The AI analyzed 2,184 messages and 184 interactions this week to generate the following insights and recommendations.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {[
              { v: successRate + '%', l: 'Action success' },
              { v: formatNumber(replyCount), l: 'AI replies' },
              { v: '94%', l: 'Churn accuracy' },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/10 px-4 py-3 text-center backdrop-blur">
                <p className="text-2xl font-semibold">{s.v}</p>
                <p className="text-xs text-white/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="AI-generated replies" value={formatNumber(replyCount)} hint="Sent this week" icon={<Sparkles className="h-5 w-5" />} tone="violet" />
        <StatTile label="Sentiment analyzed" value="2,184" hint="Across all channels" icon={<Smile className="h-5 w-5" />} tone="success" />
        <StatTile label="Predictions made" value="284" hint="Last 7 days" icon={<Brain className="h-5 w-5" />} tone="brand" />
        <StatTile label="Actions recommended" value={recommendations.length} hint={`${recommendations.filter((r) => r.status === 'Pending').length} pending`} icon={<Target className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Customer health radar" description="Aggregate score across 6 dimensions" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={customerHealthRadar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={12} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
                <Radar name="Score" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.35} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sentiment by emotion" description="Detected emotional categories" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sentimentEmotion} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {sentimentEmotion.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="AI reply volume" description="Daily WhatsApp replies generated by AI" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={aiReplyVolume}>
                <defs>
                  <linearGradient id="aiReply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="sent" stroke="#8b5cf6" fill="url(#aiReply)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Customer growth vs churn" description="Net new customers vs churned per month" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={customerGrowth}>
                <defs>
                  <linearGradient id="new" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="churned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="new" stroke="#10b981" fill="url(#new)" strokeWidth={2} />
                <Area type="monotone" dataKey="churned" stroke="#ef4444" fill="url(#churned)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="What the AI learned this week" description="Closed-loop outcomes from your executed actions" action={<Link to="/reports" className="text-sm font-medium text-brand-700">View report <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        <CardBody className="space-y-3">
          {[
            { tag: 'Personal Call', tone: 'success' as const, text: 'Personal calls consistently outperform discounts for high-value customers. Suggest increasing priority for customers with CLV > ₹5L.' },
            { tag: 'Discount', tone: 'warning' as const, text: 'Discounts show diminishing returns after the second offer. Consider capping at one per customer per year.' },
            { tag: 'Email Follow-up', tone: 'info' as const, text: 'Email follow-ups are most effective within 48h of a positive interaction — not as a generic check-in.' },
          ].map((i) => (
            <div key={i.tag} className="flex items-start gap-3 rounded-lg border border-ink-100 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge tone={i.tone}>{i.tag}</Badge>
                  <span className="text-xs text-ink-500">Closed-loop insight</span>
                </div>
                <p className="mt-1.5 text-sm text-ink-700">{i.text}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}
