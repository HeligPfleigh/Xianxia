'use client'

import { useEffect, useState } from 'react'
import styles from './ReadingProgress.module.css'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100)))
      } else {
        setProgress(0)
      }
    }

    // Initial check
    updateProgress()

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className={styles.container}>
      <div 
        className={styles.bar} 
        style={{ width: `${progress}%` }} 
      />
    </div>
  )
}
