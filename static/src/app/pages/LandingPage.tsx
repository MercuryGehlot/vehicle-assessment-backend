import { Link } from 'react-router';
import { Eye, Shield, BarChart3, Clock } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Vahan <span className="text-blue-600">नेत्र</span>
                </h1>
                <p className="text-xs text-slate-500">AI Vehicle Inspection</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <button className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">AI-Powered Detection</span>
          </div>

          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Intelligent Vehicle
            <br />
            Damage Assessment
          </h2>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Upload a photo of your vehicle and get instant AI-powered damage detection with detailed severity analysis and repair recommendations.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <Link to="/signup">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                Start Free Scan
              </button>
            </Link>
            <Link to="/login">
              <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium text-lg">
                Sign In
              </button>
            </Link>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 blur-3xl" />
            <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700">Upload → Analyze → Report</p>
                  <p className="text-sm text-slate-500 mt-2">Get results in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why Choose Vahan Netra?
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">AI Detection</h4>
              <p className="text-slate-600 text-sm">
                Advanced YOLO-based machine learning model trained on thousands of vehicle damage images
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Instant Results</h4>
              <p className="text-slate-600 text-sm">
                Get comprehensive damage assessment reports in under 10 seconds
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">DSI Scoring</h4>
              <p className="text-slate-600 text-sm">
                Damage Severity Index provides objective measurement from 0-100
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Secure Storage</h4>
              <p className="text-slate-600 text-sm">
                All scan history and reports saved securely in your personal dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-slate-900">Vahan नेत्र</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 Vahan Netra. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
