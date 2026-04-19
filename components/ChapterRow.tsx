import Link from 'next/link'
import styles from './ChapterRow.module.css'
import type { Chapter } from '@/lib/novels'

interface ChapterRowProps {
  chapter: Chapter
  novelSlug: string
}

export default function ChapterRow({ chapter, novelSlug }: ChapterRowProps) {
  return (
    <Link
      href={`/novels/${novelSlug}/${chapter.number}`}
      className={styles.row}
      id={`chapter-row-${chapter.number}`}
    >
      <span className={styles.number}>
        {String(chapter.number).padStart(2, '0')}
      </span>
      <div className={styles.content}>
        <div className={styles.title}>{chapter.title}</div>
        <div className={styles.subtitle}>{chapter.subtitle}</div>
      </div>
      <div className={styles.right}>
        <span className={styles.readTime}>{chapter.readMinutes} phút đọc</span>
        <svg
          className={styles.chevron}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </Link>
  )
}
