import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { AppLayout, AuthLayout } from '@/components/layout/AppLayout'
import { RequireAuth } from '@/components/RequireAuth'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { CustomerDetailPage } from '@/pages/CustomerDetailPage'
import { LeadsPage } from '@/pages/LeadsPage'
import { LeadDetailPage } from '@/pages/LeadDetailPage'
import { PipelinePage } from '@/pages/PipelinePage'
import { WhatsAppPage } from '@/pages/WhatsAppPage'
import { TicketsPage } from '@/pages/TicketsPage'
import { AiInsightsPage } from '@/pages/AiInsightsPage'
import { NextBestActionPage } from '@/pages/NextBestActionPage'
import { ChurnPage } from '@/pages/ChurnPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { UsersPage } from '@/pages/UsersPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/login/:role" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />

        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/leads" element={<RequireAuth roles={['admin', 'manager', 'sales']}><LeadsPage /></RequireAuth>} />
          <Route path="/leads/:id" element={<RequireAuth roles={['admin', 'manager', 'sales']}><LeadDetailPage /></RequireAuth>} />
          <Route path="/pipeline" element={<RequireAuth roles={['admin', 'manager', 'sales']}><PipelinePage /></RequireAuth>} />
          <Route path="/whatsapp" element={<WhatsAppPage />} />
          <Route path="/tickets" element={<RequireAuth roles={['admin', 'manager', 'support']}><TicketsPage /></RequireAuth>} />
          <Route path="/ai-insights" element={<AiInsightsPage />} />
          <Route path="/churn" element={<RequireAuth roles={['admin', 'manager', 'sales']}><ChurnPage /></RequireAuth>} />
          <Route path="/next-best-action" element={<RequireAuth roles={['admin', 'manager', 'sales']}><NextBestActionPage /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth roles={['admin', 'manager']}><ReportsPage /></RequireAuth>} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/users" element={<RequireAuth roles={['admin']}><UsersPage /></RequireAuth>} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
