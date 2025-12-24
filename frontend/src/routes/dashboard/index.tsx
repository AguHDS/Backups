import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/lib/router/guards';
import { Dashboard } from '@/views/dashboard';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  )
}