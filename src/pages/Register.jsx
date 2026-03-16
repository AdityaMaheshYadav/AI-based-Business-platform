import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: call POST /api/auth/register via axios
    console.log('Register:', form)
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type} required
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-indigo-500 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-xl text-brand-900">NexusAI</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Start your free 14-day trial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('name', 'Full Name', 'text', 'Jane Smith')}
          {field('company', 'Company', 'text', 'Acme Corp')}
          {field('email', 'Work Email', 'email', 'jane@acme.com')}
          {field('password', 'Password', 'password', '8+ characters')}

          <p className="text-xs text-gray-400">
            By signing up you agree to our{' '}
            <a href="#" className="text-brand-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>.
          </p>

          <button type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
