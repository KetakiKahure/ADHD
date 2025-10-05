import React, { useState } from 'react'
import useStore from '../store'

export default function TaskForm(){
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState(25)
  const addTask = useStore(s => s.addTask)

  const onSubmit = (e) => {
    e.preventDefault()
    if(!title.trim()) return
    addTask(title.trim(), Number(duration))
    setTitle('')
    setDuration(25)
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task" className="flex-1 p-2 border rounded" />
        <input value={duration} onChange={e=>setDuration(e.target.value)} type="number" min="5" max="120" className="w-24 p-2 border rounded" />
        <button className="px-4 py-2 bg-green-500 text-white rounded">Add</button>
      </div>
    </form>
  )
}
