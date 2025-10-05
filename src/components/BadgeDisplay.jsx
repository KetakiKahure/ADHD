import React from 'react'
import useStore from '../store'

export default function BadgeDisplay(){
  const points = useStore(s => s.points)

  const badges = [
    { id: 1, name: 'First Focus', unlocked: points >= 10 },
    { id: 2, name: 'Streak Starter', unlocked: points >= 50 },
  ]

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="mb-2">Badges</h3>
      <div className="flex gap-3">
        {badges.map(b => (
          <div key={b.id} className="p-3 rounded border text-center w-24">
            <div className="text-2xl">{b.unlocked ? '🏅' : '🔒'}</div>
            <div className="text-sm mt-1">{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
