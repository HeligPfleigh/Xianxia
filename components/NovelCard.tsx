import Link from 'next/link'
import Image from 'next/image'
import styles from './NovelCard.module.css'
import type { Novel } from '@/lib/novels'

interface NovelCardProps {
  novel: Novel
}

export default function NovelCard({ novel }: NovelCardProps) {
  return (
    <Link href={`/novels/${novel.slug}`} className={styles.card} id={`card-${novel.slug}`}>
      <div className={styles.imageWrapper}>
        <Image
          src={novel.coverImage}
          alt={novel.title}
          fill
          className={styles.coverImage}
          sizes="(max-width: 640px) 50vw, 25vw"
        />
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{novel.title}</div>
        <div className={styles.meta}>
          {novel.author} • {novel.genre}
        </div>
      </div>
    </Link>
  )
}
