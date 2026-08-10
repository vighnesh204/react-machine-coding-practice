import React, { useEffect, useState } from 'react'

const UseEffectHook = () => {
  const [user, setUser] = useState(null)

  const fetchData = async () => {
    try {
      const raw = await fetch('https://randomuser.me/api/')
      const data = await raw.json()
      setUser(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <h3>UseEffectHook</h3>
      <h4>{user?.results?.[0]?.name?.first ?? 'Loading...'}</h4>
    </div>
  )
}

export default UseEffectHook