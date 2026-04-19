import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav} id="main-nav">
      <Link href="/" className={styles.logo}>
        Truyện Tiên Hiệp
      </Link>
    </nav>
  )
}
