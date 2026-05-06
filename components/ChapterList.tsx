'use client'

import React, { useState } from 'react'
import ChapterRow from './ChapterRow'
import Pagination from './Pagination'
import styles from '../app/novels/[slug]/page.module.css'

interface Chapter {
  number: number
  title: string
  subtitle: string
  readMinutes: number
}

interface ChapterListProps {
  chapters: Chapter[]
  novelSlug: string
  chaptersPerPage?: number
}

const ChapterList: React.FC<ChapterListProps> = ({ 
  chapters, 
  novelSlug, 
  chaptersPerPage = 50 
}) => {
  const totalChapters = chapters.length
  const totalPages = Math.ceil(totalChapters / chaptersPerPage)

  const [currentPage, setCurrentPage] = useState(totalPages)
  
  const startIndex = (currentPage - 1) * chaptersPerPage
  const endIndex = startIndex + chaptersPerPage
  const paginatedChapters = chapters.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Optional: scroll to top of chapter list
    const section = document.getElementById('chapters-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className={styles.chaptersHeader}>
        <h2 className={styles.chaptersTitle}>Các chương</h2>
        <span className={styles.chaptersMeta}>
          {totalChapters} chương 
          {totalPages > 1 && ` • Trang ${currentPage}/${totalPages}`}
        </span>
      </div>
      
      <div className={styles.chaptersList}>
        {paginatedChapters.map((chapter) => (
          <ChapterRow
            key={chapter.number}
            chapter={chapter as any}
            novelSlug={novelSlug}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange}
        />
      )}
    </>
  )
}

export default ChapterList
