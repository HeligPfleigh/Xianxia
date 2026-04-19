import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChapterRow from '@/components/ChapterRow'
import { getAllNovels, getNovelBySlug } from '@/lib/novels'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  const novels = getAllNovels()
  return novels.map((novel) => ({ slug: novel.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const novel = getNovelBySlug(slug)
  if (!novel) return {}
  return {
    title: novel.title,
    description: novel.description,
  }
}

export default async function NovelDetailPage({ params }: PageProps) {
  const { slug } = await params
  const novel = getNovelBySlug(slug)
  if (!novel) notFound()

  const totalMinutes = novel.chapters.reduce((sum, ch) => sum + ch.readMinutes, 0)
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  return (
    <>
      <Navbar/>

      {/* Hero */}
      <section className={`${styles.hero} animateFadeIn`} id="novel-hero">
        <div className={styles.coverWrapper}>
          <Image
            src={novel.coverImage}
            alt={novel.title}
            fill
            className={styles.coverImage}
            priority
          />
        </div>
        <div className={styles.details}>
          {novel.badge && <span className={styles.badge}>{novel.badge}</span>}
          <h1 className={styles.title}>{novel.title}</h1>
          <p className={styles.author}>của {novel.author}</p>
          <div className={styles.description}>
            <ReactMarkdown>{novel.description}</ReactMarkdown>
          </div>
          <Link
            href={`/novels/${novel.slug}/${novel.chapters[0].number}`}
            className={styles.startBtn}
            id="btn-start-reading"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Bắt đầu đọc
          </Link>
        </div>
      </section>

      {/* Chapters */}
      <section className={styles.chaptersSection} id="chapters-section">
        <div className={styles.chaptersHeader}>
          <h2 className={styles.chaptersTitle}>Các chương</h2>
          <span className={styles.chaptersMeta}>
            {novel.chapters.length} chương • {hours > 0 ? `${hours}h ` : ''}{mins} phút tổng cộng
          </span>
        </div>
        <div className={styles.chaptersList}>
          {novel.chapters.map((chapter) => (
            <ChapterRow
              key={chapter.number}
              chapter={chapter}
              novelSlug={novel.slug}
            />
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
