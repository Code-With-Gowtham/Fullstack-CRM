import type { Customer, Lead, Role, User } from '@/types'

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export const apiEnabled = apiBaseUrl.length > 0

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

interface AuthResult {
  accessToken: string
  user: User
}

export type CustomerCreateInput = Pick<Customer, 'name' | 'email' | 'company'> &
  Partial<Omit<Customer, 'id' | 'name' | 'email' | 'company'>>
export type CustomerUpdateInput = Partial<Omit<Customer, 'id'>>
export type LeadCreateInput = Pick<Lead, 'name' | 'email' | 'company'> &
  Partial<Omit<Lead, 'id' | 'name' | 'email' | 'company'>>
export type LeadUpdateInput = Partial<Omit<Lead, 'id'>>

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiEnabled) throw new Error('Set VITE_API_URL to enable the backend.')
  const headers = new Headers(init.headers)
  if (init.body) headers.set('Content-Type', 'application/json')
  const token = window.sessionStorage.getItem('pulsecrm-access-token')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${apiBaseUrl}/api/v1${path}`, { ...init, headers })
  if (response.status === 204) return undefined as T
  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'detail' in data && typeof data.detail === 'string'
        ? data.detail
        : `Request failed (${response.status}).`
    throw new ApiError(message, response.status)
  }
  return data as T
}

export function apiLogin(email: string, password: string) {
  return request<AuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function apiRegister(input: {
  name: string
  email: string
  password: string
  organizationName: string
}) {
  return request<AuthResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function apiMe() {
  return request<User>('/auth/me')
}

export function apiListCustomers() {
  return request<Customer[]>('/customers')
}

export function apiCreateCustomer(input: CustomerCreateInput) {
  return request<Customer>('/customers', { method: 'POST', body: JSON.stringify(input) })
}

export function apiGetCustomer(id: string) {
  return request<Customer>(`/customers/${encodeURIComponent(id)}`)
}

export function apiUpdateCustomer(id: string, input: CustomerUpdateInput) {
  return request<Customer>(`/customers/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function apiDeleteCustomer(id: string) {
  return request<void>(`/customers/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function apiListLeads() {
  return request<Lead[]>('/leads')
}

export function apiCreateLead(input: LeadCreateInput) {
  return request<Lead>('/leads', { method: 'POST', body: JSON.stringify(input) })
}

export function apiGetLead(id: string) {
  return request<Lead>(`/leads/${encodeURIComponent(id)}`)
}

export function apiUpdateLead(id: string, input: LeadUpdateInput) {
  return request<Lead>(`/leads/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function apiDeleteLead(id: string) {
  return request<void>(`/leads/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function isRole(role: string): role is Role {
  return ['admin', 'manager', 'sales', 'support'].includes(role)
}
