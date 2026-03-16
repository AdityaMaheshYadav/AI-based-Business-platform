import { useState } from 'react'

const sampleQueries = [
  "What drove last week's revenue dip?",
  "Which customers are most likely to churn this month?",
  "Show me top performing products in Q2",
  "Compare conversion rates across segments",
]

const fakeResponses = {
  "What drove last week's revenue dip?": "Revenue dropped 8% last week primarily due to a 23% decline in Enterprise segment conversions. The AI identified a correlation with the pricing page A/B test variant B — recommend reverting to variant A.",
  "Which customers are most likely to churn this month?": "Top 3 churn risks this month: Acme Corp (87% risk), RetailCo (91% risk), and TechStart Inc (62% risk). Recommend scheduling proactive outreach calls within 48 hours.",
  "Show me top performing products in Q2": "Top performers in Q2: 1) Analytics Pro — $840K revenue (+31%), 2) Voice Assistant Add-on — $320K (+18%), 3) Custom Dashboard — $210K (+9%). All three exceeded forecast.",
  "Compare conversion rates across segments": "Enterprise: 12.4% (+2.1%), SMB: 8.7% (+0.9%), Startup: 5.2% (-0.3%), Consumer: 3.1% (+0.1%). Enterprise segment is outperforming all others — recommend reallocating 15% of SMB ad spend to Enterprise.",
}

export default function VoicePanel() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)

  const ask = (q) => {
    const text = q || query
    if (!text.trim()) return
    setQuery(text)
    setLoading(true)
    setResponse('')
    setTimeout(() => {
      setResponse(fakeResponses[text] || "I analyzed your data and found no significant anomalies for that query. Try asking about revenue, churn, or product performance.")
      setLoading(false)
    }, 1200)
  }

  const toggleListen = () => {
    setListening(l => !l)
    if (!listening) {
      setTimeout(() => {
        setListening(false)
        setQuery(sampleQueries[Math.floor(Math.random() * sampleQueries.length)])
      }, 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Voice Assistant</h2>
        <p className="text-gray-500 text-sm mt-1">Ask questions about your business in plain English</p>
      </div>

      {/* Mic + input */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center gap-6">
        <button
          onClick={toggleListen}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
            listening
              ? 'bg-red-500 animate-pulse scale-110'
              : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm0 2a2 2 0 00-2 2v6a2 2 0 004 0V5a2 2 0 00-2-2zm-7 9a7 7 0 0014 0h2a9 9 0 01-8 8.94V23h-2v-2.06A9 9 0 013 12H5z" />
          </svg>
        </button>
        <p className="text-sm text-gray-400">{listening ? 'Listening...' : 'Click mic or type below'}</p>

        <div className="w-full flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask()}
            placeholder="Ask anything about your business..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button onClick={() => ask()}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            Ask
          </button>
        </div>
      </div>

      {/* Response */}
      {(loading || response) && (
        <div className="bg-white rounded-xl p-6 border border-brand-100 shadow-sm">
          {loading
            ? <div className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                Analyzing your data...
              </div>
            : <p className="text-gray-700 leading-relaxed">{response}</p>
          }
        </div>
      )}

      {/* Sample queries */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Try asking</p>
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map(q => (
            <button key={q} onClick={() => ask(q)}
              className="text-xs bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-brand-200">
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
