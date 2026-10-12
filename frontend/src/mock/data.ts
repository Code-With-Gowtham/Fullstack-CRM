import type {
  User,
  Lead,
  Customer,
  Purchase,
  Interaction,
  Conversation,
  Message,
  SupportTicket,
  ChurnPrediction,
  Recommendation,
  Notification,
  AuditLog,
  KpiSnapshot,
  PipelineStage,
  Permission,
} from '@/types'

export const users: User[] = [
  { id: 'u1', name: 'Gowtham Raj', email: 'gowtham@pulsecrm.com', role: 'admin', department: 'Operations', status: 'active', avatarColor: 'bg-rose-500', initials: 'GR', joinedAt: '2023-01-12' },
  { id: 'u2', name: 'Ram Kumar', email: 'ram@pulsecrm.com', role: 'manager', department: 'Sales', status: 'active', avatarColor: 'bg-amber-500', initials: 'RK', joinedAt: '2023-03-04' },
  { id: 'u3', name: 'Raja Muthu', email: 'raja@pulsecrm.com', role: 'sales', department: 'Sales', status: 'active', avatarColor: 'bg-emerald-500', initials: 'RM', joinedAt: '2023-06-21' },
  { id: 'u4', name: 'Meena Devi', email: 'meena@pulsecrm.com', role: 'sales', department: 'Sales', status: 'active', avatarColor: 'bg-sky-500', initials: 'MD', joinedAt: '2023-09-15' },
  { id: 'u5', name: 'Karthik Iyer', email: 'karthik@pulsecrm.com', role: 'sales', department: 'Sales', status: 'inactive', avatarColor: 'bg-violet-500', initials: 'KI', joinedAt: '2024-01-09' },
  { id: 'u6', name: 'Anjali Devi', email: 'anjali@pulsecrm.com', role: 'support', department: 'Support', status: 'active', avatarColor: 'bg-teal-500', initials: 'AD', joinedAt: '2024-02-02' },
  { id: 'u7', name: 'Senthil Kumar', email: 'senthil@pulsecrm.com', role: 'support', department: 'Support', status: 'active', avatarColor: 'bg-fuchsia-500', initials: 'SK', joinedAt: '2024-04-18' },
]

export const currentUser = users[2] // default to a sales executive for the demo

export const permissions: Permission[] = [
  { key: 'manage_users', label: 'Manage users', roles: { admin: true, manager: false, sales: false, support: false } },
  { key: 'view_all_leads', label: 'View all leads', roles: { admin: true, manager: true, sales: false, support: false } },
  { key: 'assign_leads', label: 'Assign leads', roles: { admin: true, manager: true, sales: false, support: false } },
  { key: 'view_assigned_leads', label: 'View assigned leads', roles: { admin: true, manager: true, sales: true, support: true } },
  { key: 'add_leads', label: 'Add leads', roles: { admin: true, manager: true, sales: true, support: false } },
  { key: 'send_messages', label: 'Send messages', roles: { admin: true, manager: true, sales: true, support: true } },
  { key: 'ai_reply', label: 'AI reply generation', roles: { admin: true, manager: true, sales: true, support: true } },
  { key: 'view_churn', label: 'View churn predictions', roles: { admin: true, manager: true, sales: true, support: false } },
  { key: 'view_nba', label: 'View Next-Best-Action', roles: { admin: true, manager: true, sales: true, support: false } },
  { key: 'view_analytics', label: 'View analytics', roles: { admin: true, manager: true, sales: false, support: false } },
  { key: 'manage_tickets', label: 'Manage support tickets', roles: { admin: true, manager: true, sales: false, support: true } },
  { key: 'audit_logs', label: 'View audit logs', roles: { admin: true, manager: false, sales: false, support: false } },
]

const companies = [
  ['ABC Technologies', 'Software', 'Mumbai'],
  ['Globex Industries', 'Manufacturing', 'Pune'],
  ['Innova Retail', 'Retail', 'Bengaluru'],
  ['Sunrise Logistics', 'Logistics', 'Delhi'],
  ['Helix Pharma', 'Healthcare', 'Hyderabad'],
  ['Vertex Finance', 'Finance', 'Mumbai'],
  ['BlueOcean Media', 'Media', 'Chennai'],
  ['Northstar Edu', 'Education', 'Pune'],
  ['Quantum Energy', 'Energy', 'Gandhinagar'],
  ['Lumen Hospitality', 'Hospitality', 'Goa'],
  ['Cobalt Mobility', 'Automotive', 'Bengaluru'],
  ['Atlas Agriculture', 'Agriculture', 'Nashik'],
  ['Pinecone Realty', 'Real Estate', 'Mumbai'],
  ['Crimson Cosmetics', 'Beauty', 'Bengaluru'],
  ['Orion Consulting', 'Consulting', 'Delhi'],
] as const

const leadSources = ['Website', 'WhatsApp', 'Referral', 'Cold Call', 'LinkedIn', 'Trade Show', 'Google Ads']
const leadStatuses: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Converted', 'Lost']
const firstNames = ['Gowtham', 'Ram', 'Raja', 'Karthik', 'Meena', 'Arjun', 'Kavin', 'Lakshmi', 'Rahul', 'Anjali', 'Mohan', 'Saanvi', 'Yash', 'Pooja', 'Manav']
const lastNames = ['Kumar', 'Reddy', 'Nair', 'Iyer', 'Subramanian', 'Patel', 'Joshi', 'Rao', 'Menon', 'Sharma', 'Bose', 'Das', 'Muthu', 'Pillai', 'Verma']

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length]
}

function rng(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}
const rand = rng(42)

export const leads: Lead[] = Array.from({ length: 36 }, (_, i) => {
  const fn = pick(firstNames, i)
  const ln = pick(lastNames, i + 3)
  const [company, industry, location] = pick(companies, i)
  const status = pick(leadStatuses, Math.floor(rand() * 7))
  const score = Math.floor(35 + rand() * 65)
  const temp = score >= 80 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold'
  const assignee = pick(users.filter((u) => u.role === 'sales'), i)
  return {
    id: `L-${1000 + i}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `+91 98${Math.floor(10000000 + rand() * 89999999)}`,
    company,
    location,
    industry,
    source: pick(leadSources, i),
    assignedTo: assignee.name,
    status,
    score,
    temperature: temp,
    createdAt: `2026-${String(((i % 7) + 1)).padStart(2, '0')}-${String(((i * 3) % 27) + 1).padStart(2, '0')}`,
    lastContactedAt: `2026-08-${String(((i * 2) % 19) + 1).padStart(2, '0')}`,
    expectedRevenue: Math.floor(20000 + rand() * 280000),
    notes:
      i % 3 === 0
        ? 'Interested in enterprise plan; requested pricing PDF.'
        : i % 3 === 1
        ? 'Compared against competitor, prefers our WhatsApp integration.'
        : 'Needs demo with technical team next week.',
  }
})

export const customers: Customer[] = Array.from({ length: 28 }, (_, i) => {
  const fn = pick(firstNames, i + 5)
  const ln = pick(lastNames, i + 1)
  const [company, industry, location] = pick(companies, i + 2)
  const churnProb = Math.floor(5 + rand() * 90)
  const risk = churnProb >= 65 ? 'High' : churnProb >= 35 ? 'Medium' : 'Low'
  const sentimentScore = rand()
  const sentiment = sentimentScore > 0.6 ? 'Positive' : sentimentScore > 0.3 ? 'Neutral' : 'Negative'
  const value = i % 4 === 0 ? 'High' : i % 3 === 0 ? 'Medium' : 'Low'
  const segment = pick(['Champion', 'Loyal', 'At Risk', 'Hibernating', 'New'] as const, i)
  const assignee = pick(users.filter((u) => u.role === 'sales' || u.role === 'support'), i)
  return {
    id: `C-${2000 + i}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `+91 98${Math.floor(10000000 + rand() * 89999999)}`,
    company,
    industry,
    location,
    type: i % 3 === 0 ? 'Enterprise' : i % 2 === 0 ? 'SMB' : 'Startup',
    value: value as Customer['value'],
    segment,
    churnProbability: churnProb,
    churnRisk: risk,
    sentiment: sentiment as Customer['sentiment'],
    sentimentScore: sentimentScore,
    assignedTo: assignee.name,
    totalRevenue: Math.floor(50000 + rand() * 950000),
    purchaseCount: Math.floor(1 + rand() * 24),
    lastPurchaseAt: `2026-${String(((i % 8) + 1)).padStart(2, '0')}-${String(((i * 5) % 27) + 1).padStart(2, '0')}`,
    lastInteractionAt: `2026-08-${String(((i * 2) % 19) + 1).padStart(2, '0')}`,
    nextFollowUpAt: `2026-08-${String(((i * 3) % 28) + 1).padStart(2, '0')}`,
    createdAt: `2024-${String(((i % 12) + 1)).padStart(2, '0')}-${String(((i * 7) % 27) + 1).padStart(2, '0')}`,
    whatsapp: `+91 98${Math.floor(10000000 + rand() * 89999999)}`,
  }
})

export const purchases: Purchase[] = Array.from({ length: 60 }, (_, i) => ({
  id: `P-${3000 + i}`,
  customerId: customers[i % customers.length].id,
  product: pick(['Enterprise Plan', 'Pro Plan', 'Starter Plan', 'Add-on: Analytics', 'Add-on: Support', 'Training Session'] as const, i),
  amount: Math.floor(5000 + rand() * 200000),
  date: `2026-${String(((i % 8) + 1)).padStart(2, '0')}-${String(((i * 3) % 27) + 1).padStart(2, '0')}`,
  status: pick(['Completed', 'Completed', 'Completed', 'Pending', 'Refunded'] as const, i),
}))

const interactionTypes: Interaction['type'][] = ['WhatsApp', 'Email', 'Call', 'Support', 'Meeting', 'Note']
const sentiments: Interaction['sentiment'][] = ['Positive', 'Neutral', 'Negative']
const summaries = [
  'Discussed renewal options',
  'Complaint about delayed delivery',
  'Asked about new feature',
  'Requested invoice copy',
  'Product onboarding call',
  'Expressed dissatisfaction with support',
  'Confirmed upgrade to Pro plan',
  'Asked about pricing for additional seats',
  'Provided positive feedback',
  'Reported a billing issue',
]

export const interactions: Interaction[] = Array.from({ length: 90 }, (_, i) => ({
  id: `I-${4000 + i}`,
  customerId: customers[i % customers.length].id,
  type: pick(interactionTypes, i),
  direction: i % 2 === 0 ? 'Inbound' : 'Outbound',
  summary: pick(summaries, i),
  sentiment: pick(sentiments, i),
  date: `2026-08-${String(((i * 2) % 19) + 1).padStart(2, '0')}`,
  agent: pick(users.filter((u) => u.role !== 'admin'), i).name,
}))

const chatSeed: { from: 'customer' | 'agent'; text: string; ai?: boolean }[][] = [
  [
    { from: 'customer', text: 'Hi, my order has not arrived yet. Can you check?' },
    { from: 'agent', text: "I'm sorry for the delay. I'll check your order status and help you with the latest delivery information.", ai: true },
    { from: 'customer', text: 'This is the third time I have asked. Nobody has solved my issue.' },
    { from: 'agent', text: 'I completely understand your frustration. Let me escalate this to our logistics team right now and get back to you within the hour.', ai: true },
  ],
  [
    { from: 'customer', text: 'I want to upgrade my plan.' },
    { from: 'agent', text: 'Great to hear! May I know which plan you are interested in?' },
    { from: 'customer', text: 'The Enterprise plan. Send me the quote.' },
    { from: 'agent', text: "Sure, sending the Enterprise quote and a comparison sheet shortly.", ai: true },
  ],
  [
    { from: 'customer', text: 'Thanks for the quick support yesterday!' },
    { from: 'agent', text: 'Glad we could help! Let us know if anything else comes up.' },
  ],
]

export const conversations: Conversation[] = customers.slice(0, 8).map((c, i) => ({
  id: `V-${5000 + i}`,
  customerId: c.id,
  channel: 'WhatsApp',
  subject: i === 0 ? 'Order delivery delay' : i === 1 ? 'Plan upgrade inquiry' : i === 2 ? 'Thanks for support' : 'General inquiry',
  lastMessage: chatSeed[i % chatSeed.length].slice(-1)[0].text,
  lastMessageAt: `2026-08-${String(15 + (i % 5)).padStart(2, '0')}`,
  unread: i < 2 ? 1 + (i % 2) : 0,
  status: pick(['Open', 'Pending', 'Resolved'] as const, i),
  assignedAgent: pick(users.filter((u) => u.role === 'support' || u.role === 'sales'), i).name,
  messages: chatSeed[i % chatSeed.length].map((m, j) => ({
    id: `M-${6000 + i}-${j}`,
    conversationId: `V-${5000 + i}`,
    from: m.from,
    text: m.text,
    aiGenerated: m.ai,
    sentiment: m.from === 'customer' ? pick(['Negative', 'Neutral', 'Positive'] as const, j) : undefined,
    timestamp: `2026-08-${String(15 + (i % 5)).padStart(2, '0')} ${String(9 + j).padStart(2, '0')}:${String(j * 17).padStart(2, '0')}`,
  })) as Message[],
}))

export const tickets: SupportTicket[] = customers.slice(0, 14).map((c, i) => ({
  id: `T-${7000 + i}`,
  customerId: c.id,
  subject: pick(
    [
      'Order not delivered',
      'Refund not processed',
      'Login issue',
      'Feature request',
      'Bug in dashboard',
      'Invoice correction',
      'Subscription renewal',
    ] as const,
    i,
  ),
  description: 'Customer reported issue via WhatsApp. Needs immediate attention from the assigned agent.',
  priority: pick(['Low', 'Medium', 'High', 'Urgent'] as const, i),
  status: pick(['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed'] as const, i),
  assignedAgent: pick(users.filter((u) => u.role === 'support'), i).name,
  createdAt: `2026-08-${String(((i * 2) % 19) + 1).padStart(2, '0')}`,
  resolvedAt: i % 2 === 0 ? `2026-08-${String(((i * 2) % 19) + 1).padStart(2, '0')}` : undefined,
  sentiment: pick(['Positive', 'Neutral', 'Negative'] as const, i),
}))

export const churnPredictions: ChurnPrediction[] = customers.map((c) => ({
  customerId: c.id,
  probability: c.churnProbability,
  risk: c.churnRisk,
  factors: [
    { feature: 'Reduced purchase frequency', contribution: 18 + Math.floor(rand() * 25) },
    { feature: 'Negative sentiment', contribution: 10 + Math.floor(rand() * 22) },
    { feature: 'Unresolved complaints', contribution: 8 + Math.floor(rand() * 18) },
    { feature: 'Low engagement', contribution: 6 + Math.floor(rand() * 16) },
    { feature: 'Time since last purchase', contribution: 5 + Math.floor(rand() * 12) },
  ].sort((a, b) => b.contribution - a.contribution),
  predictedAt: '2026-08-19',
}))

export const recommendations: Recommendation[] = customers.slice(0, 12).map((c, i) => {
  const alts = [
    { action: 'Personal Support Call' as const, score: 87, reason: 'High customer value + previous positive response to personal outreach' },
    { action: 'Premium Support' as const, score: 78, reason: 'Customer has multiple unresolved complaints' },
    { action: 'Product Upgrade' as const, score: 65, reason: 'Frequent usage of pro features' },
    { action: 'Discount' as const, score: 54, reason: 'Customer is price-sensitive based on history' },
    { action: 'Personalized Follow-up' as const, score: 41, reason: 'Fallback option if more direct actions fail' },
  ]
  return {
    id: `R-${8000 + i}`,
    customerId: c.id,
    recommendedAction: alts[0].action,
    confidence: alts[0].score,
    reason:
      'High churn probability combined with negative sentiment and high customer value. Customer has responded positively to personal outreach in the past.',
    alternatives: alts,
    status: pick(['Pending', 'Approved', 'Executed', 'Rejected'] as const, i),
    outcome: pick(['Pending', 'Successful', 'Unsuccessful', 'Partial'] as const, i),
    generatedAt: `2026-08-${String(((i * 2) % 19) + 1).padStart(2, '0')}`,
    approvedBy: i % 3 === 0 ? users[1].name : undefined,
    executedAt: i % 2 === 0 ? `2026-08-${String(((i * 2) % 19) + 1).padStart(2, '0')}` : undefined,
    outcomeNotes: i % 4 === 0 ? 'Customer renewed subscription for 12 months.' : i % 4 === 1 ? 'Customer requested more time to decide.' : undefined,
  }
})

export const notifications: Notification[] = [
  { id: 'n1', type: 'churn', title: 'High churn risk detected', body: 'ABC Technologies has a churn probability of 84%.', read: false, createdAt: '2026-08-19 09:12', link: '/customers/C-2000' },
  { id: 'n2', type: 'lead', title: 'New lead assigned', body: `${leads[1].name} from ${leads[1].company} was assigned to you.`, read: false, createdAt: '2026-08-19 08:45', link: '/leads/L-1001' },
  { id: 'n3', type: 'message', title: 'Urgent WhatsApp message', body: 'Globex Industries replied negatively to the renewal offer.', read: false, createdAt: '2026-08-19 08:30', link: '/whatsapp' },
  { id: 'n4', type: 'follow-up', title: 'Follow-up due today', body: 'Vertex Finance follow-up is scheduled for today.', read: true, createdAt: '2026-08-19 07:00', link: '/customers' },
  { id: 'n5', type: 'recommendation', title: 'AI recommendation ready', body: 'New Next-Best-Action for ABC Technologies.', read: true, createdAt: '2026-08-18 18:22', link: '/next-best-action' },
  { id: 'n6', type: 'ticket', title: 'Urgent support ticket', body: 'Urgent ticket from Innova Retail needs attention.', read: true, createdAt: '2026-08-18 17:10', link: '/tickets' },
]

export const auditLogs: AuditLog[] = Array.from({ length: 18 }, (_, i) => ({
  id: `A-${9000 + i}`,
  user: pick(users, i).name,
  action: pick(['Logged in', 'Updated customer', 'Approved recommendation', 'Created lead', 'Sent WhatsApp', 'Closed ticket', 'Updated role'] as const, i),
  target: pick(['ABC Technologies', 'L-1014', 'T-7003', 'R-8001', 'User: Anjali Devi'] as const, i),
  timestamp: `2026-08-${String(19 - (i % 19)).padStart(2, '0')} ${String(9 + (i % 9)).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}`,
  ip: `192.168.1.${100 + (i % 50)}`,
}))

export const kpis: KpiSnapshot = {
  totalCustomers: customers.length,
  activeCustomers: customers.filter((c) => c.lastInteractionAt >= '2026-08-10').length,
  newCustomers: customers.filter((c) => c.createdAt >= '2026-08-01').length,
  totalLeads: leads.length,
  qualifiedLeads: leads.filter((l) => ['Qualified', 'Proposal', 'Negotiation'].includes(l.status)).length,
  convertedLeads: leads.filter((l) => l.status === 'Converted').length,
  lostLeads: leads.filter((l) => l.status === 'Lost').length,
  highChurnRisk: customers.filter((c) => c.churnRisk === 'High').length,
  revenue: customers.reduce((sum, c) => sum + c.totalRevenue, 0),
  conversionRate: 32,
  openTickets: tickets.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length,
  pendingFollowUps: customers.filter((c) => c.nextFollowUpAt <= '2026-08-20').length,
  aiRecommendations: recommendations.filter((r) => r.status === 'Pending').length,
}

export const pipeline: PipelineStage[] = [
  { stage: 'New', count: leads.filter((l) => l.status === 'New').length, value: leads.filter((l) => l.status === 'New').reduce((s, l) => s + l.expectedRevenue, 0), conversionRate: 100 },
  { stage: 'Contacted', count: leads.filter((l) => l.status === 'Contacted').length, value: leads.filter((l) => l.status === 'Contacted').reduce((s, l) => s + l.expectedRevenue, 0), conversionRate: 78 },
  { stage: 'Qualified', count: leads.filter((l) => l.status === 'Qualified').length, value: leads.filter((l) => l.status === 'Qualified').reduce((s, l) => s + l.expectedRevenue, 0), conversionRate: 56 },
  { stage: 'Proposal', count: leads.filter((l) => l.status === 'Proposal').length, value: leads.filter((l) => l.status === 'Proposal').reduce((s, l) => s + l.expectedRevenue, 0), conversionRate: 42 },
  { stage: 'Negotiation', count: leads.filter((l) => l.status === 'Negotiation').length, value: leads.filter((l) => l.status === 'Negotiation').reduce((s, l) => s + l.expectedRevenue, 0), conversionRate: 31 },
  { stage: 'Converted', count: leads.filter((l) => l.status === 'Converted').length, value: leads.filter((l) => l.status === 'Converted').reduce((s, l) => s + l.expectedRevenue, 0), conversionRate: 24 },
]

export const revenueTrend = [
  { month: 'Jan', revenue: 420000, target: 450000 },
  { month: 'Feb', revenue: 480000, target: 460000 },
  { month: 'Mar', revenue: 510000, target: 490000 },
  { month: 'Apr', revenue: 530000, target: 510000 },
  { month: 'May', revenue: 590000, target: 540000 },
  { month: 'Jun', revenue: 620000, target: 580000 },
  { month: 'Jul', revenue: 680000, target: 620000 },
  { month: 'Aug', revenue: 710000, target: 660000 },
]

export const leadSourceDistribution = [
  { name: 'Website', value: 32 },
  { name: 'WhatsApp', value: 24 },
  { name: 'Referral', value: 18 },
  { name: 'LinkedIn', value: 12 },
  { name: 'Google Ads', value: 8 },
  { name: 'Trade Show', value: 6 },
]

export const sentimentDistribution = [
  { name: 'Positive', value: customers.filter((c) => c.sentiment === 'Positive').length },
  { name: 'Neutral', value: customers.filter((c) => c.sentiment === 'Neutral').length },
  { name: 'Negative', value: customers.filter((c) => c.sentiment === 'Negative').length },
]

export const churnRiskDistribution = [
  { name: 'Low', value: customers.filter((c) => c.churnRisk === 'Low').length, color: '#10b981' },
  { name: 'Medium', value: customers.filter((c) => c.churnRisk === 'Medium').length, color: '#f59e0b' },
  { name: 'High', value: customers.filter((c) => c.churnRisk === 'High').length, color: '#ef4444' },
]

export const actionEffectiveness = [
  { action: 'Personal Call', successRate: 82 },
  { action: 'Premium Support', successRate: 76 },
  { action: 'Product Upgrade', successRate: 69 },
  { action: 'Discount', successRate: 61 },
  { action: 'Email Follow-up', successRate: 48 },
]

export const salespersonPerformance = users
  .filter((u) => u.role === 'sales' || u.role === 'manager')
  .map((u, i) => ({
    name: u.name.split(' ')[0],
    leads: 18 + i * 7,
    converted: 6 + i * 3,
    revenue: 180000 + i * 95000,
  }))

export const customerGrowth = [
  { month: 'Jan', new: 4, churned: 1 },
  { month: 'Feb', new: 6, churned: 2 },
  { month: 'Mar', new: 8, churned: 1 },
  { month: 'Apr', new: 5, churned: 3 },
  { month: 'May', new: 9, churned: 2 },
  { month: 'Jun', new: 11, churned: 2 },
  { month: 'Jul', new: 8, churned: 4 },
  { month: 'Aug', new: 12, churned: 3 },
]
