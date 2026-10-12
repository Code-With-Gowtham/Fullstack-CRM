// Core domain types for the AI-Powered CRM

export type Role = 'admin' | 'manager' | 'sales' | 'support'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department: string
  status: 'active' | 'inactive'
  avatarColor: string
  initials: string
  joinedAt: string
}

export interface Permission {
  key: string
  label: string
  roles: Record<Role, boolean>
}

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal'
  | 'Negotiation'
  | 'Converted'
  | 'Lost'

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  location: string
  industry: string
  source: string
  assignedTo: string
  status: LeadStatus
  score: number
  temperature: LeadTemperature
  createdAt: string
  lastContactedAt: string
  expectedRevenue: number
  notes: string
}

export type CustomerSegment = 'Champion' | 'Loyal' | 'At Risk' | 'Hibernating' | 'New'
export type CustomerValue = 'High' | 'Medium' | 'Low'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  industry: string
  location: string
  type: 'Enterprise' | 'SMB' | 'Startup'
  value: CustomerValue
  segment: CustomerSegment
  churnProbability: number
  churnRisk: 'Low' | 'Medium' | 'High'
  sentiment: 'Positive' | 'Neutral' | 'Negative'
  sentimentScore: number
  assignedTo: string
  totalRevenue: number
  purchaseCount: number
  lastPurchaseAt: string
  lastInteractionAt: string
  nextFollowUpAt: string
  createdAt: string
  whatsapp: string
}

export interface Purchase {
  id: string
  customerId: string
  product: string
  amount: number
  date: string
  status: 'Completed' | 'Pending' | 'Refunded'
}

export interface Interaction {
  id: string
  customerId: string
  type: 'WhatsApp' | 'Email' | 'Call' | 'Support' | 'Meeting' | 'Note'
  direction: 'Inbound' | 'Outbound'
  summary: string
  sentiment: 'Positive' | 'Neutral' | 'Negative'
  date: string
  agent: string
}

export interface Message {
  id: string
  conversationId: string
  from: 'customer' | 'agent'
  text: string
  sentiment?: 'Positive' | 'Neutral' | 'Negative'
  aiGenerated?: boolean
  timestamp: string
}

export interface Conversation {
  id: string
  customerId: string
  channel: 'WhatsApp' | 'Email' | 'In-App'
  subject: string
  lastMessage: string
  lastMessageAt: string
  unread: number
  status: 'Open' | 'Pending' | 'Resolved'
  assignedAgent: string
  messages: Message[]
}

export type TicketStatus = 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed'
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export interface SupportTicket {
  id: string
  customerId: string
  subject: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  assignedAgent: string
  createdAt: string
  resolvedAt?: string
  sentiment: 'Positive' | 'Neutral' | 'Negative'
}

export interface ChurnFactor {
  feature: string
  contribution: number // percent
}

export interface ChurnPrediction {
  customerId: string
  probability: number
  risk: 'Low' | 'Medium' | 'High'
  factors: ChurnFactor[]
  predictedAt: string
}

export type ActionType =
  | 'Personal Support Call'
  | 'Premium Support'
  | 'Product Upgrade'
  | 'Discount'
  | 'Personalized Follow-up'
  | 'Email Campaign'
  | 'WhatsApp Message'
  | 'Schedule Demo'

export type ActionStatus = 'Pending' | 'Approved' | 'Rejected' | 'Executed'
export type ActionOutcome = 'Pending' | 'Successful' | 'Unsuccessful' | 'Partial'

export interface ActionScore {
  action: ActionType
  score: number // 0-100
  reason: string
}

export interface Recommendation {
  id: string
  customerId: string
  recommendedAction: ActionType
  confidence: number
  reason: string
  alternatives: ActionScore[]
  status: ActionStatus
  outcome: ActionOutcome
  generatedAt: string
  approvedBy?: string
  executedAt?: string
  outcomeNotes?: string
}

export interface Notification {
  id: string
  type: 'lead' | 'churn' | 'message' | 'follow-up' | 'recommendation' | 'ticket'
  title: string
  body: string
  read: boolean
  createdAt: string
  link?: string
}

export interface AuditLog {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  ip: string
}

export interface KpiSnapshot {
  totalCustomers: number
  activeCustomers: number
  newCustomers: number
  totalLeads: number
  qualifiedLeads: number
  convertedLeads: number
  lostLeads: number
  highChurnRisk: number
  revenue: number
  conversionRate: number
  openTickets: number
  pendingFollowUps: number
  aiRecommendations: number
}

export interface PipelineStage {
  stage: LeadStatus
  count: number
  value: number
  conversionRate: number
}
