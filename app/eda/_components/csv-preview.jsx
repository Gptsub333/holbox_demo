import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import CsvTable from "./csv-table"

export default function CsvPreview({ csvData }) {
  if (!csvData) return null

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-gray-600" />
          CSV Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CsvTable headers={csvData.headers} rows={csvData.rows} />
      </CardContent>
    </Card>
  )
}
