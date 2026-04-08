import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AI Resume Tool</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">👋 {user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-500 mb-8">Generate AI-powered cover letters and analyze your resume</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div  onClick={() => navigate('/cover-letter')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cover Letter Generator</h3>
            <p className="text-gray-500 text-sm">Generate a personalized cover letter based on the job description</p>
          </div>

          <div onClick={() => navigate('/resume-analyzer')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Resume Analyzer</h3>
            <p className="text-gray-500 text-sm">Analyze your resume against a job description and get a match score</p>
          </div>
        </div>
      </div>
    </div>
  )
}