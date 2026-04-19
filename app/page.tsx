
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NovelCard from '@/components/NovelCard'
import { getAllNovels } from '@/lib/novels'
import styles from './page.module.css'

export default function DiscoverPage() {
  const novels = getAllNovels()
  return (
    <>
      <Navbar />
      <div className={styles.grid} id="novel-grid">
        {novels.map((novel, i) => (
          <div
            key={novel.slug}
            className={`animateFadeInUp delay${i + 1}`}
          >
            <NovelCard novel={novel} />
          </div>
        ))}
      </div>
      <Footer />
    </>
  )
}
