const recommendations = [
  {
    id: 1,
    type: 'Upsell',
    customer: 'Acme Corp',
    product: 'Enterprise Analytics Pro',
    confidence: 94,
    revenue: '$12,000',
    reason: 'High usage of base tier, 3 feature requests for advanced reporting',
  },
  {
    id: 2,
    type: 'Cross-sell',
    customer: 'TechStart Inc',
    product: 'AI Voice Assistant Add-on',
    confidence: 81,
    revenue: '$3,600',
    reason: 'Similar companies in cohort adopted voice features with 78% retention boost',
  },
  {
    id: 3,
    type: 'Retention',
    customer: 'RetailCo',
    product: 'Loyalty Discount Offer',
    confidence: 88,
    revenue: '$8,400 saved',
    reason: 'Predicted 67% churn probability — proactive offer reduces risk by 44%',
  },
  {
    id: 4,
    type: 'Upsell',
    customer: 'LogiCorp',
    product: 'Custom Dashboard Module',
    confidence: 76,
    revenue: '$5,200',
    reason: 'Frequent dashboard exports suggest need for custom reporting tools',
  },
]

const typeColor = {
  Upsell: 'bg-blue-100 text-blue-700',
  'Cross-sell': 'bg-purple-100 text-purple-700',
  Retention: 'bg-orange-100 text-orange-700',
}

export default function RecommendationPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Smart Recommendation Engine</h2>
        <p className="text-gray-500 text-sm mt-1">AI-generated actions ranked by revenue impact and confidence</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[['Total Opportunities', '4', ''], ['Potential Revenue', '$29.2K', ''], ['Avg Confidence', '85%', '']].map(([l, v]) => (
          <div key={l} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-xs text-gray-400 font-medium">{l}</p>
            <p className="text-2xl font-bold text-brand-600 mt-1">{v}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {recommendations.map(r => (
          <div key={r.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor[r.type]}`}>{r.type}</span>
                  <span className="text-sm font-semibold text-gray-900">{r.customer}</span>
                </div>
                <p className="text-gray-800 font-medium">{r.product}</p>
                <p className="text-gray-400 text-xs mt-1">{r.reason}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-green-600 font-bold text-sm">{r.revenue}</p>
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${r.confidence}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{r.confidence}%</span>
                </div>
              </div>
            </div>
            <button className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 hover:border-brand-400 px-3 py-1 rounded-lg transition-colors">
              Take Action →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
