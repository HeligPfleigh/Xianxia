import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChapterRow from '@/components/ChapterRow'
import { getAllNovels, getNovelBySlug } from '@/lib/novels'
import ChapterList from '@/components/ChapterList'
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
  const novel = getNovelBySlug(slug, false) // Don't include content for list page
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
          <div className={styles.heroActions}>
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
            <Link
              href={`/novels/${novel.slug}/${novel.chapters[novel.chapters.length - 1].number}`}
              className={styles.latestBtn}
              id="btn-latest-chapter"
            >
              Chương mới nhất
            </Link>
            <a
              href={`/${novel.slug}.epub`}
              download
              className={styles.downloadBtn}
              id="btn-download-epub"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Tải Epub
            </a>
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section className={styles.chaptersSection} id="chapters-section">
        <ChapterList 
          chapters={novel.chapters} 
          novelSlug={novel.slug} 
        />
      </section>


      <Footer />
    </>
  )
}
