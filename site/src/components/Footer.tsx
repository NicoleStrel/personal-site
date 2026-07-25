import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section__inner site-footer__inner">
        <p className="site-footer__copy">© {new Date().getFullYear()} Nicole Streltsov</p>
      </div>
    </footer>
  )
}
