import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useEntries() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEntries = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (error) setError(error.message)
    else setEntries(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const createEntry = async ({ title, content, mood, tags, entry_date }) => {
    const { data, error } = await supabase
      .from('entries')
      .insert([{ user_id: user.id, title, content, mood, tags, entry_date }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    setEntries(prev => [data, ...prev])
    return data
  }

  const updateEntry = async (id, updates) => {
    const { data, error } = await supabase
      .from('entries')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    setEntries(prev => prev.map(e => e.id === id ? data : e))
    return data
  }

  const deleteEntry = async (id) => {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const getStreak = () => {
    if (!entries.length) return 0
    const dates = entries.map(e => e.entry_date).sort((a, b) => b.localeCompare(a))
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (dates[0] !== today && dates[0] !== yesterday) return 0

    let streak = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1])
      const curr = new Date(dates[i])
      const diff = (prev - curr) / 86400000
      if (diff === 1) streak++
      else break
    }
    return streak
  }

  return { entries, loading, error, createEntry, updateEntry, deleteEntry, getStreak, refetch: fetchEntries }
}
