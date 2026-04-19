import { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Search, AlertCircle, CheckCircle, Calendar, Filter } from 'lucide-react';

const mockHistory = [
  {
    id: '1',
    date: '2026-04-18',
    time: '14:30',
    vehicleName: 'Toyota Camry 2022',
    plateNumber: 'MH 01 AB 1234',
    dsiScore: 35,
    severity: 'Moderate',
    damagesFound: 2,
    category: 'COSMETIC',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'
  },
  {
    id: '2',
    date: '2026-04-15',
    time: '10:15',
    vehicleName: 'Honda Civic 2021',
    plateNumber: 'MH 02 CD 5678',
    dsiScore: 68,
    severity: 'High',
    damagesFound: 4,
    category: 'STRUCTURAL/FUNCTIONAL',
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400'
  },
  {
    id: '3',
    date: '2026-04-12',
    time: '16:45',
    vehicleName: 'Toyota Camry 2022',
    plateNumber: 'MH 01 AB 1234',
    dsiScore: 22,
    severity: 'Low',
    damagesFound: 1,
    category: 'COSMETIC',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'
  },
  {
    id: '4',
    date: '2026-04-10',
    time: '09:20',
    vehicleName: 'BMW 3 Series 2023',
    plateNumber: 'MH 03 EF 9012',
    dsiScore: 45,
    severity: 'Moderate',
    damagesFound: 3,
    category: 'STRUCTURAL/FUNCTIONAL',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'
  },
  {
    id: '5',
    date: '2026-04-08',
    time: '11:30',
    vehicleName: 'Mercedes C-Class 2022',
    plateNumber: 'MH 04 GH 3456',
    dsiScore: 18,
    severity: 'Low',
    damagesFound: 1,
    category: 'COSMETIC',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400'
  }
];

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredHistory = mockHistory.filter(scan => {
    const matchesSearch = scan.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scan.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'all' || scan.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Scan History</h1>
          <p className="text-slate-600">View all your vehicle damage assessments</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by vehicle name or plate number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="COSMETIC">Cosmetic</option>
                <option value="STRUCTURAL/FUNCTIONAL">Structural/Functional</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredHistory.map((scan) => (
            <div
              key={scan.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-6">
                <img
                  src={scan.imageUrl}
                  alt={scan.vehicleName}
                  className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {scan.vehicleName}
                      </h3>
                      <p className="text-sm text-slate-500">{scan.plateNumber}</p>
                    </div>

                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      scan.category === 'STRUCTURAL/FUNCTIONAL'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {scan.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Date</p>
                        <p className="text-sm font-medium text-slate-900">{scan.date}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">DSI Score</p>
                      <p className={`text-2xl font-bold ${
                        scan.dsiScore >= 60 ? 'text-red-600' :
                        scan.dsiScore >= 40 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {scan.dsiScore}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Severity</p>
                      <div className="flex items-center gap-2">
                        {scan.severity === 'High' ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        <p className="text-sm font-medium text-slate-900">{scan.severity}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Issues Found</p>
                      <p className="text-2xl font-bold text-slate-900">{scan.damagesFound}</p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        scan.dsiScore >= 60 ? 'bg-red-600' :
                        scan.dsiScore >= 40 ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${scan.dsiScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500">No scans found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
