import React from 'react'
import Link from 'next/link'
import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
  onPageChange?: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, baseUrl, onPageChange }) => {
  if (totalPages <= 1) return null

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    if (onPageChange) {
      e.preventDefault()
      onPageChange(page)
    }
  }

  const getPageUrl = (page: number) => {
    return baseUrl ? `${baseUrl}?page=${page}` : '#'
  }

  // Generate page numbers to show
  const pages = []
  const delta = 2
  const left = currentPage - delta
  const right = currentPage + delta + 1
  let l: number | undefined

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      pages.push(i)
    }
  }

  return (
    <nav className={styles.pagination}>
      {currentPage > 1 ? (
        <Link 
          href={getPageUrl(currentPage - 1)} 
          className={styles.pageBtn}
          onClick={(e) => handlePageClick(e, currentPage - 1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Trước
        </Link>
      ) : (
        <span className={`${styles.pageBtn} ${styles.disabled}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Trước
        </span>
      )}

      <div className={styles.pageNumbers}>
        {pages.map((p, i) => {
          const showEllipsis = l !== undefined && p - l !== 1
          l = p
          return (
            <React.Fragment key={p}>
              {showEllipsis && <span className={styles.ellipsis}>...</span>}
              <Link
                href={getPageUrl(p)}
                className={`${styles.pageNumber} ${p === currentPage ? styles.active : ''}`}
                onClick={(e) => handlePageClick(e, p)}
              >
                {p}
              </Link>
            </React.Fragment>
          )
        })}
      </div>

      {currentPage < totalPages ? (
        <Link 
          href={getPageUrl(currentPage + 1)} 
          className={styles.pageBtn}
          onClick={(e) => handlePageClick(e, currentPage + 1)}
        >
          Tiếp
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      ) : (
        <span className={`${styles.pageBtn} ${styles.disabled}`}>
          Tiếp
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      )}
    </nav>
  )
}

export default Pagination
