import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function CsvTable({ headers, rows }) {
  if (!headers || !rows || rows.length === 0) {
    return <p className="text-gray-500">No data to display.</p>
  }

  return (
    <div className="w-full overflow-x-auto border rounded-lg max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="font-bold bg-gray-50">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(
            (
              row,
              rowIndex, // Preview first 10 rows
            ) => (
              <TableRow key={rowIndex}>
                {headers.map((header) => (
                  <TableCell key={`${rowIndex}-${header}`}>{row[header]}</TableCell>
                ))}
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  )
}
