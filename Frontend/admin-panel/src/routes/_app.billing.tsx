import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Banknote, CreditCard, RefreshCw, TrendingUp } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listInvoices, listPlans, getOverview } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { KpiCard } from '@/components/charts/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import type { Invoice, Plan } from '@/lib/schemas';

export const Route = createFileRoute('/_app/billing')({
  component: BillingPage,
});

function BillingPage() {
  const plans = useQuery({ queryKey: ['plans'], queryFn: () => apiCall(listPlans, undefined) });
  const invoices = useQuery({
    queryKey: ['invoices', 'global'],
    queryFn: () => apiCall(listInvoices, { pageSize: 100, sort: 'issuedAt', dir: 'desc' }),
  });
  const overview = useQuery({ queryKey: ['overview'], queryFn: () => apiCall(getOverview, undefined) });

  const planCols = useMemo<ColumnDef<Plan, unknown>[]>(
    () => [
      { id: 'tier', header: 'Tier', accessorKey: 'tier' },
      {
        id: 'price',
        header: 'Monthly',
        accessorKey: 'monthlyPriceUsd',
        cell: ({ row }) => formatCurrency(row.original.monthlyPriceUsd),
      },
      {
        id: 'annual',
        header: 'Annual',
        accessorKey: 'annualPriceUsd',
        cell: ({ row }) => formatCurrency(row.original.annualPriceUsd),
      },
      { id: 'convos', header: 'Convos / mo', accessorKey: 'includedConversations' },
      { id: 'seats', header: 'Seats', accessorKey: 'includedSeats' },
      {
        id: 'active',
        header: 'Active',
        accessorKey: 'active',
        cell: ({ row }) => (
          <Badge tone={row.original.active ? 'success' : 'neutral'}>
            {row.original.active ? 'Active' : 'Off'}
          </Badge>
        ),
      },
    ],
    [],
  );

  const invoiceCols = useMemo<ColumnDef<Invoice, unknown>[]>(
    () => [
      { id: 'number', header: 'Invoice', accessorKey: 'number' },
      {
        id: 'issued',
        header: 'Issued',
        accessorKey: 'issuedAt',
        cell: ({ row }) => format(new Date(row.original.issuedAt), 'MMM d, yyyy'),
      },
      { id: 'hospital', header: 'Hospital', accessorKey: 'hospitalId' },
      {
        id: 'amount',
        header: 'Amount',
        accessorKey: 'amountUsd',
        cell: ({ row }) => formatCurrency(row.original.amountUsd),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.status === 'paid'
                ? 'success'
                : row.original.status === 'open'
                  ? 'warning'
                  : 'neutral'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Billing & Plans"
        description="Revenue health across the fleet — MRR, ARR, churn, and per-tenant invoices."
      />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          label="MRR"
          value={overview.data ? formatCurrency(overview.data.mrrUsd) : <Skeleton className="h-7 w-24" />}
          icon={<Banknote className="size-3.5" />}
        />
        <KpiCard
          label="ARR"
          value={overview.data ? formatCurrency(overview.data.mrrUsd * 12) : <Skeleton className="h-7 w-24" />}
          icon={<TrendingUp className="size-3.5" />}
        />
        <KpiCard label="Net new MRR" value="$24,150" icon={<TrendingUp className="size-3.5" />} delta={{ value: 12.4 }} />
        <KpiCard label="Logo churn" value="0.8%" icon={<RefreshCw className="size-3.5" />} delta={{ value: -0.2 }} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent invoices</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <DataTable
              data={invoices.data?.items ?? []}
              columns={invoiceCols}
              isLoading={invoices.isLoading}
              className="border-0 rounded-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="inline-flex items-center gap-2">
                <CreditCard className="size-3.5 text-[var(--color-tertiary)]" />
                Plans
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <DataTable
              data={plans.data ?? []}
              columns={planCols}
              isLoading={plans.isLoading}
              className="border-0 rounded-none"
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
