import { ReportUploader } from "@/components/report-uploader"
import { ReportTable } from "@/components/report-table"
import { ParameterCharts } from "@/components/parameter-charts"
import { RecentReports } from "@/components/recent-reports"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Upload and manage your health lab reports</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <ReportUploader />
        </div>
        <div>
          <RecentReports />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="col-span-2">
          <ReportTable />
        </div>
      </div>
      <div>
        <ParameterCharts />
      </div>
    </div>
  )
}
