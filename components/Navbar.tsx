import Link from 'next/link'
import styles from './Navbar.module.css'

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Navbar({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
  return (
    <nav className={styles.nav} id="main-nav">
      <div className={styles.breadcrumbWrapper}>
        <Link href="/" className={styles.logo}>
          Truyện Tiên Hiệp
        </Link>
        
        {breadcrumbs.length > 0 && (
          <div className={styles.breadcrumbs}>
            {breadcrumbs.map((item, index) => (
              <div key={index} className={styles.breadcrumbItem}>
                <span className={styles.separator}>/</span>
                {item.href ? (
                  <Link href={item.href} className={styles.breadcrumbLink}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={styles.breadcrumbCurrent}>{item.label}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
