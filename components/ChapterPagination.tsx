'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './ChapterPagination.module.css'

interface ChapterPaginationProps {
  chapters: { number: number; title: string }[]
  currentChapter: number
  slug: string
}

const ChapterPagination: React.FC<ChapterPaginationProps> = ({ chapters, currentChapter, slug }) => {
  const router = useRouter()
  
  const currentIndex = chapters.findIndex(ch => ch.number === currentChapter)
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chapterNum = e.target.value
    router.push(`/novels/${slug}/${chapterNum}`)
  }

  return (
    <nav className={styles.pagination}>
      <div className={styles.navGroup}>
        {prevChapter ? (
          <Link 
            href={`/novels/${slug}/${prevChapter.number}`} 
            className={styles.navLink}
            title={`Chương trước: ${prevChapter.title}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className={styles.navText}>Trước</span>
          </Link>
        ) : (
          <span className={`${styles.navLink} ${styles.disabled}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className={styles.navText}>Trước</span>
          </span>
        )}
      </div>

      <div className={styles.centerGroup}>
        <div className={styles.selectorWrapper}>
          <select 
            className={styles.chapterSelect} 
            value={currentChapter} 
            onChange={handleChapterChange}
            aria-label="Chọn chương"
          >
            {chapters.map(ch => (
              <option key={ch.number} value={ch.number}>
                Chương {ch.number}: {ch.title}
              </option>
            ))}
          </select>
          <div className={styles.selectorIcon}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <div className={styles.progressText}>
          {currentIndex + 1} / {chapters.length}
        </div>
      </div>

      <div className={styles.navGroup}>
        {nextChapter ? (
          <Link 
            href={`/novels/${slug}/${nextChapter.number}`} 
            className={styles.navLink}
            title={`Chương tiếp: ${nextChapter.title}`}
          >
            <span className={styles.navText}>Tiếp</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ) : (
          <span className={`${styles.navLink} ${styles.disabled}`}>
            <span className={styles.navText}>Tiếp</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        )}
      </div>
    </nav>
  )
}

export default ChapterPagination
