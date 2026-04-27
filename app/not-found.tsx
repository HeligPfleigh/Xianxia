import Link from 'next/link'
import Image from 'next/image'
import styles from './not-found.module.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <Navbar />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.illustration}>
          <Image 
            src="/404-illustration.png" 
            alt="Page not found illustration" 
            width={300} 
            height={300}
            className={styles.heroImage}
          />
        </div>

        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page not found</h2>
        <p className={styles.description}>
          We can't seem to find the book or chapter you're looking for.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            Back to Discover
          </Link>
        </div>

        
      </main>

      <Footer />
    </div>
  )
}
