import React from 'react'
import useStore from '../store'

export default function PointsStreak(){
  const points = useStore(s => s.points)
  return (
    <div className="bg-white p-4 rounded shadow-sm text-center">
      <div className="text-sm text-gray-500">Points</div>
      <div className="text-2xl font-bold">{points}</div>
    </div>
  )
}
