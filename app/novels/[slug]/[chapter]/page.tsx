import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import { getAllNovels, getNovelBySlug, getChapter } from '@/lib/novels'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ slug: string; chapter: string }>
}

export function generateStaticParams() {
  const novels = getAllNovels()
  const paths: { slug: string; chapter: string }[] = []
  for (const novel of novels) {
    for (const ch of novel.chapters) {
      paths.push({ slug: novel.slug, chapter: String(ch.number) })
    }
  }
  return paths
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, chapter: chapterStr } = await params
  const novel = getNovelBySlug(slug)
  const chapter = novel ? getChapter(slug, Number(chapterStr)) : undefined
  if (!novel || !chapter) return {}
  return {
    title: `Chương ${chapter.number}: ${chapter.title} — ${novel.title}`,
    description: chapter.subtitle,
  }
}

export default async function ChapterReaderPage({ params }: PageProps) {
  const { slug, chapter: chapterStr } = await params
  const chapterNum = Number(chapterStr)
  const novel = getNovelBySlug(slug)
  const chapter = novel ? getChapter(slug, chapterNum) : undefined

  if (!novel || !chapter) notFound()

  const isFirst = chapterNum <= novel.chapters[0].number
  const isLast = chapterNum >= novel.chapters[novel.chapters.length - 1].number

  const prevChapter = novel.chapters.find(ch => ch.number < chapterNum)
  const nextChapter = novel.chapters.find(ch => ch.number > chapterNum)

  const prevHref = prevChapter ? `/novels/${slug}/${prevChapter.number}` : ''
  const nextHref = nextChapter ? `/novels/${slug}/${nextChapter.number}` : ''

  return (
    <>
      <Navbar />
      <Sidebar />


      <article className={styles.readerContainer} id="chapter-reader">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          {novel.genre.toUpperCase()} CỦA {novel.author.toUpperCase()}
        </div>

        {/* Title */}
        <h1 className={styles.chapterTitle}>
          Chương {chapter.number}: {chapter.title}
        </h1>

        {/* Meta */}
        <div className={styles.metaBar}>
          <span className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {chapter.readMinutes} phút đọc
          </span>
          <span className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Bởi {novel.author}
          </span>
        </div>

        {/* Hero image */}
        {/* <div className={styles.heroImage}>
          <Image
            src="/covers/chapter-hero.svg"
            alt={`Minh họa chương ${chapter.number}`}
            fill
            className={styles.heroImg}
          />
        </div> */}

        {/* Body text */}
        <div className={styles.body}>
          <ReactMarkdown>{chapter.content}</ReactMarkdown>
        </div>

        {/* Bottom navigation */}
        <nav className={styles.bottomNav} id="chapter-nav">
          {isFirst ? (
            <span className={`${styles.navBtn} ${styles.navBtnDisabled}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Trước
            </span>
          ) : (
            <Link href={prevHref} className={styles.navBtn} id="btn-prev-chapter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Trước
            </Link>
          )}

          <div className={styles.navCenter}>
            <span className={styles.navDot} />
            <span>{chapter.title}</span>
          </div>

          {isLast ? (
            <span className={`${styles.navBtn} ${styles.navBtnDisabled}`}>
              Tiếp
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          ) : (
            <Link href={nextHref} className={styles.navBtn} id="btn-next-chapter">
              Tiếp
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
        </nav>

        <Link href={`/novels/${slug}`} className={styles.backLink} id="btn-back-to-chapters">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Quay lại danh sách chương
        </Link>
      </article>

      <Footer />
    </>
  )
}
