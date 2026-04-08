import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ResumeAnalyzer() {
  const [form, setForm] = useState({
    resumeText: '',
    jobDescription: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        'http://localhost:5000/api/ai/analyze-resume',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(res.data.analysis)
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-green-50 border-green-200'
    if (score >= 50) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AI Resume Tool</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📄 Resume Analyzer
        </h2>
        <p className="text-gray-500 mb-8">
          Paste your resume and job description to get an AI match score and feedback
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Resume
                </label>
                <textarea
                  name="resumeText"
                  value={form.resumeText}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Paste your resume text here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  value={form.jobDescription}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Paste the job description here..."
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? '🔍 Analyzing...' : '🔍 Analyze Resume'}
              </button>
            </form>
          </div>

          {/* Result */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Analysis Result</h3>

            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-500">AI is analyzing your resume...</p>
                </div>
              </div>
            )}

            {!loading && !result && (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-400 text-sm">
                  Your analysis will appear here
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Match Score */}
                <div className={`p-4 rounded-xl border ${getScoreBg(result.matchScore)}`}>
                  <p className="text-sm text-gray-600 mb-1">Match Score</p>
                  <p className={`text-4xl font-bold ${getScoreColor(result.matchScore)}`}>
                    {result.matchScore}%
                  </p>
                </div>

                {/* Summary */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-1">Summary</p>
                  <p className="text-sm text-gray-600">{result.summary}</p>
                </div>

                {/* Strengths */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">✅ Strengths</p>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">⚠️ Improvements</p>
                  <ul className="space-y-1">
                    {result.improvements.map((imp, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">•</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Keywords */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">🔑 Missing Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full border border-red-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}