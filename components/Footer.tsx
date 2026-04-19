import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} id="main-footer">
      <div className={styles.brand}>
        <span className={styles.brandName}>TTH</span>
        <span className={styles.copyright}>
          © 2026 TTH. Nền tảng đọc truyện số hàng đầu.
        </span>
      </div>
    </footer>
  )
}
