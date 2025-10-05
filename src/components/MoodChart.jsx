// src/components/MoodChart.jsx
import React from 'react'
import useStore from '../store'

function labelFor(ts){
  const d = new Date(ts)
  if((Date.now() - ts) > (24*60*60*1000)) return d.toLocaleDateString(undefined,{month:'short', day:'numeric'})
  return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
}

export default function MoodChart(){
  const moods = useStore(s => s.moods) || []
  const last7 = moods.slice(0,7).reverse()
  if(last7.length === 0) return <div className="h-40 flex items-center justify-center text-gray-400">No mood data yet — add your mood!</div>

  return (
    <div className="space-y-2">
      {last7.map(m => (
        <div key={m.id} className="flex items-center justify-between bg-white/90 p-3 rounded-md shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-xl">{m.mood.split(' ')[0]}</div>
            <div>
              <div className="text-sm font-medium">{m.mood}</div>
              {m.note && <div className="text-xs text-gray-500">{m.note}</div>}
            </div>
          </div>
          <div className="text-xs text-gray-500">{labelFor(m.timestamp)}</div>
        </div>
      ))}
    </div>
  )
}
