import { useEffect, useRef, useState } from 'react'

function RevealOnScroll({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${className} ats-reveal ${visible ? 'ats-reveal-visible' : ''}`}>
      {children}
    </div>
  )
}

export default RevealOnScroll