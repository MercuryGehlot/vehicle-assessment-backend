import { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Upload, Loader2, Eye, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

interface AssessmentData {
  inspection_summary: {
    dsi_score: number;
    overall_severity: string;
    triage_category: string;
  };
  processed_image_url: string;
  findings: Array<{
    class: string;
    confidence: number;
    box: number[];
  }>;
}

export function ScanPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setLoading(true);

    setTimeout(() => {
      const mockAssessment: AssessmentData = {
        inspection_summary: {
          dsi_score: Math.floor(Math.random() * 100),
          overall_severity: Math.random() > 0.5 ? 'High' : 'Moderate',
          triage_category: Math.random() > 0.5 ? 'STRUCTURAL/FUNCTIONAL' : 'COSMETIC'
        },
        processed_image_url: imageUrl,
        findings: [
          { class: 'Dent', confidence: 0.92, box: [120, 180, 340, 380] },
          { class: 'Scratch', confidence: 0.87, box: [450, 220, 580, 300] },
          { class: 'Crack', confidence: 0.79, box: [200, 400, 350, 480] }
        ]
      };
      setAssessment(mockAssessment);
      setLoading(false);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAssessment(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (assessment) {
    const { inspection_summary, processed_image_url, findings } = assessment;
    const { dsi_score, overall_severity, triage_category } = inspection_summary;

    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Scan Results</h1>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Scan
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className={`bg-white p-6 rounded-xl border-2 ${
              overall_severity === 'High' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
            }`}>
              <div className="flex items-center gap-3">
                {overall_severity === 'High' ? (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-yellow-600" />
                )}
                <div>
                  <p className="text-sm text-slate-600">Severity</p>
                  <p className={`text-2xl font-bold ${
                    overall_severity === 'High' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {overall_severity}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">DSI Score</p>
              <div className="flex items-end gap-3 mb-3">
                <p className={`text-4xl font-bold ${
                  dsi_score >= 60 ? 'text-red-600' :
                  dsi_score >= 40 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {dsi_score}
                </p>
                <p className="text-slate-500 mb-1">/100</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    dsi_score >= 60 ? 'bg-red-600' :
                    dsi_score >= 40 ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${dsi_score}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-600 mb-3">Category</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                triage_category === 'STRUCTURAL/FUNCTIONAL'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {triage_category}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Processed Image</h3>
              <img
                src={processed_image_url}
                alt="Analyzed vehicle"
                className="w-full rounded-lg border border-slate-200"
              />
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Detected Issues ({findings.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {findings.map((finding, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{finding.class}</p>
                        <p className="text-sm text-slate-500">
                          Position: [{finding.box.map(b => Math.round(b)).join(', ')}]
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Confidence</p>
                      <p className="text-lg font-bold text-green-600">
                        {(finding.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-2">Understanding Your Results</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>DSI Score:</strong> Damage Severity Index from 0-100 based on detected damage area</li>
              <li><strong>Cosmetic:</strong> DSI &lt; 40 - Minor visual issues</li>
              <li><strong>Structural/Functional:</strong> DSI ≥ 40 - Requires professional inspection</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">New Vehicle Scan</h1>
          <p className="text-slate-600">Upload an image to start AI-powered damage detection</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <p className="text-lg font-medium text-slate-700">Analyzing vehicle damage...</p>
                <p className="text-sm text-slate-500">This may take a few moments</p>
              </div>
            ) : selectedImage ? (
              <div className="flex flex-col items-center gap-4">
                <img src={selectedImage} alt="Selected" className="max-h-64 rounded-lg" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-700 mb-1">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm text-slate-500">Supports JPG, PNG (max 10MB)</p>
                </div>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">AI Detection</p>
              <p className="text-xs text-slate-500">YOLO-based</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm">DSI</div>
              <p className="text-sm font-medium text-slate-700">Severity Score</p>
              <p className="text-xs text-slate-500">0-100 scale</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center mx-auto mb-2 text-white font-bold text-xs">AUTO</div>
              <p className="text-sm font-medium text-slate-700">Classification</p>
              <p className="text-xs text-slate-500">Instant triage</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
