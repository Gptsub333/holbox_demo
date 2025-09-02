import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Play, CheckCircle, XCircle, Clock } from 'lucide-react';

const demoData = [
  { name: 'ML Pipeline Demo', status: 'running', duration: '2m 34s', icon: Play, color: 'bg-blue-500' },
  { name: 'Data Analysis', status: 'completed', duration: '1m 12s', icon: CheckCircle, color: 'bg-green-500' },
  { name: 'Web Scraping', status: 'failed', duration: '0m 45s', icon: XCircle, color: 'bg-red-500' },
  { name: 'Chat Interface', status: 'pending', duration: '0m 00s', icon: Clock, color: 'bg-yellow-500' },
];

const getStatusVariant = (status) => {
  switch (status) {
    case 'running':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'failed':
      return 'destructive';
    case 'pending':
      return 'outline';
    default:
      return 'secondary';
  }
};

const demos = [
  {
    name: 'ML Pipeline Demo',
    time: '2m 34s',
    status: 'running',
    color: 'bg-indigo-100 text-indigo-700',
    dot: 'bg-indigo-500',
  },
  {
    name: 'Data Analysis',
    time: '1m 12s',
    status: 'completed',
    color: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  { name: 'Web Scraping', time: '0m 45s', status: 'failed', color: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
  {
    name: 'Chat Interface',
    time: '0m 00s',
    status: 'pending',
    color: 'bg-amber-100 text-amber-800',
    dot: 'bg-amber-500',
  },
];

export function DemoTracker() {
  return (
    <>
      {/* <Card>
      <CardHeader>
        <CardTitle>Demo Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demoData.map((demo, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded-full ${demo.color}`}>
                  <demo.icon className="h-3 w-3 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{demo.name}</p>
                  <p className="text-xs text-muted-foreground">{demo.duration}</p>
                </div>
              </div>
              <Badge variant={getStatusVariant(demo.status)}>{demo.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Demo Tracker</h2>
        <ul className="mt-4 space-y-3">
          {demos.map((d) => (
            <li
              key={d.name}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-3"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${d.color}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${d.dot}`} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-gray-600">{d.time}</p>
                </div>
              </div>
              <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium capitalize">
                {d.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
