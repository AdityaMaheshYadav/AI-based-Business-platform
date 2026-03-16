import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api'

// ── Replace with your real Google Maps API key ──────────────────────────────
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'
// ────────────────────────────────────────────────────────────────────────────

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' }

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 } // New York — changes to user location

const NEARBY_BUSINESSES = [
  { id: 1, name: 'TechHub Coworking', type: 'Coworking', lat: 40.7148, lng: -74.008, rating: 4.7, promo: '20% off first month', category: 'business' },
  { id: 2, name: 'Brew & Code Café', type: 'Café', lat: 40.711, lng: -74.003, rating: 4.5, promo: 'Free WiFi + loyalty card', category: 'cafe' },
  { id: 3, name: 'Metro Print Shop', type: 'Print & Design', lat: 40.716, lng: -74.012, rating: 4.2, promo: '15% off bulk orders', category: 'service' },
  { id: 4, name: 'Nexus Networking Club', type: 'Networking', lat: 40.709, lng: -74.015, rating: 4.8, promo: 'Free guest pass this week', category: 'business' },
  { id: 5, name: 'QuickShip Logistics', type: 'Logistics', lat: 40.718, lng: -74.001, rating: 4.3, promo: 'Same-day delivery deal', category: 'service' },
  { id: 6, name: 'The Strategy Room', type: 'Consulting', lat: 40.707, lng: -74.009, rating: 4.6, promo: 'Free 30-min consultation', category: 'business' },
]

const CATEGORY_COLORS = {
  business: '#4f46e5',
  cafe:     '#f59e0b',
  service:  '#10b981',
}

const CATEGORY_ICONS = { business: '🏢', cafe: '☕', service: '🔧' }

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
  ],
}

export default function MapPanel() {
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [locating, setLocating] = useState(false)
  const mapRef = useRef(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  const onMapLoad = useCallback((map) => { mapRef.current = map }, [])

  const locateMe = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCenter(loc)
        mapRef.current?.panTo(loc)
        mapRef.current?.setZoom(14)
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  const filtered = filter === 'all'
    ? NEARBY_BUSINESSES
    : NEARBY_BUSINESSES.filter(b => b.category === filter)

  const activePromos = NEARBY_BUSINESSES.filter(b => b.promo)

  if (loadError) return (
    <div className="flex items-center justify-center h-64 bg-red-50 rounded-xl border border-red-100">
      <div className="text-center">
        <p className="text-red-600 font-semibold">Failed to load Google Maps</p>
        <p className="text-red-400 text-sm mt-1">Check your API key in MapPanel.jsx</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Map & Local Business Engagement</h2>
          <p className="text-gray-500 text-sm mt-1">Nearby businesses, local promotions and engagement opportunities</p>
        </div>
        <button onClick={locateMe} disabled={locating}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60">
          {locating
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <span>📍</span>}
          {locating ? 'Locating...' : 'Use My Location'}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Nearby Businesses', value: NEARBY_BUSINESSES.length, icon: '🏢' },
          { label: 'Active Promotions', value: activePromos.length, icon: '🎁' },
          { label: 'Engagement Score', value: '87%', icon: '📈' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[['all', 'All'], ['business', '🏢 Business'], ['cafe', '☕ Café'], ['service', '🔧 Service']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border
              ${filter === val
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Map + sidebar layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 420 }}>
          {!isLoaded ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading map...</p>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={center}
              zoom={14}
              options={mapOptions}
              onLoad={onMapLoad}
            >
              {/* Radius circle */}
              <Circle
                center={center}
                radius={800}
                options={{
                  fillColor: '#4f46e5',
                  fillOpacity: 0.06,
                  strokeColor: '#4f46e5',
                  strokeOpacity: 0.3,
                  strokeWeight: 1.5,
                }}
              />

              {/* Business markers */}
              {filtered.map(biz => (
                <Marker
                  key={biz.id}
                  position={{ lat: biz.lat, lng: biz.lng }}
                  onClick={() => setSelected(biz)}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: CATEGORY_COLORS[biz.category],
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 2,
                  }}
                />
              ))}

              {/* Info window */}
              {selected && (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div className="p-1 min-w-[180px]">
                    <p className="font-bold text-gray-900 text-sm">{selected.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{selected.type}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-xs text-gray-600">{selected.rating}</span>
                    </div>
                    {selected.promo && (
                      <div className="mt-2 bg-green-50 border border-green-200 rounded px-2 py-1">
                        <p className="text-green-700 text-xs font-semibold">🎁 {selected.promo}</p>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>

        {/* Business list */}
        <div className="space-y-2 overflow-y-auto max-h-[420px] pr-1">
          {filtered.map(biz => (
            <div key={biz.id}
              onClick={() => { setSelected(biz); mapRef.current?.panTo({ lat: biz.lat, lng: biz.lng }) }}
              className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md
                ${selected?.id === biz.id ? 'border-brand-400 shadow-md' : 'border-gray-100'}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{CATEGORY_ICONS[biz.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{biz.name}</p>
                  <p className="text-gray-400 text-xs">{biz.type}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-500">{biz.rating}</span>
                  </div>
                  {biz.promo && (
                    <p className="text-xs text-green-600 font-medium mt-1.5 bg-green-50 px-2 py-0.5 rounded-full inline-block">
                      🎁 {biz.promo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotions strip */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Active Local Promotions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activePromos.map(biz => (
            <div key={biz.id}
              className="bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>{CATEGORY_ICONS[biz.category]}</span>
                <p className="font-semibold text-gray-900 text-sm">{biz.name}</p>
              </div>
              <p className="text-brand-700 text-sm font-medium">🎁 {biz.promo}</p>
              <button className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-800 border border-brand-200 hover:border-brand-400 px-3 py-1 rounded-lg transition-colors">
                Claim Offer →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
