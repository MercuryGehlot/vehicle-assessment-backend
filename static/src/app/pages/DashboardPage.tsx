import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { ScanLine, TrendingUp, Clock, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';

const mockScans = [
  {
    id: '1',
    date: '2026-04-18',
    vehicleName: 'Toyota Camry',
    dsiScore: 35,
    severity: 'Moderate',
    damagesFound: 2,
    category: 'COSMETIC'
  },
  {
    id: '2',
    date: '2026-04-15',
    vehicleName: 'Honda Civic',
    dsiScore: 68,
    severity: 'High',
    damagesFound: 4,
    category: 'STRUCTURAL/FUNCTIONAL'
  },
  {
    id: '3',
    date: '2026-04-12',
    vehicleName: 'Toyota Camry',
    dsiScore: 22,
    severity: 'Low',
    damagesFound: 1,
    category: 'COSMETIC'
  }
];

export function DashboardPage() {
  const { user } = useAuth();

  const totalScans = mockScans.length;
  const avgDSI = (mockScans.reduce((sum, scan) => sum + scan.dsiScore, 0) / totalScans).toFixed(1);
  const totalDamages = mockScans.reduce((sum, scan) => sum + scan.damagesFound, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-slate-600">Here's an overview of your vehicle assessments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ScanLine className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalScans}</p>
            <p className="text-sm text-slate-600">Total Scans</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{avgDSI}</p>
            <p className="text-sm text-slate-600">Average DSI Score</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalDamages}</p>
            <p className="text-sm text-slate-600">Issues Detected</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {mockScans.length > 0 ? 'Today' : 'N/A'}
            </p>
            <p className="text-sm text-slate-600">Last Scan</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to scan a vehicle?</h2>
              <p className="text-blue-100">Upload an image and get instant AI-powered damage detection</p>
            </div>
            <Link to="/scan">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2">
                <ScanLine className="w-5 h-5" />
                New Scan
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Scans</h2>
            <Link to="/history" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {mockScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    scan.severity === 'High' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {scan.severity === 'High' ? (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{scan.vehicleName}</p>
                    <p className="text-sm text-slate-500">{scan.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm text-slate-600">DSI Score</p>
                    <p className={`text-lg font-bold ${
                      scan.dsiScore >= 60 ? 'text-red-600' :
                      scan.dsiScore >= 40 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {scan.dsiScore}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-600">Issues</p>
                    <p className="text-lg font-bold text-slate-900">{scan.damagesFound}</p>
                  </div>

                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      scan.category === 'STRUCTURAL/FUNCTIONAL'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {scan.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
