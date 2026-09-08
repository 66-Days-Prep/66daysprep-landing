'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollReveal() {
  const [visible, setVisible] = useState(true)
  const previousScrollPositionRef = useRef(0)

  useEffect(() => {
    let frameId = 0
    previousScrollPositionRef.current = window.scrollY

    const handleScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        const currentScrollPosition = window.scrollY
        const previousScrollPosition = previousScrollPositionRef.current
        if (Math.abs(previousScrollPosition - currentScrollPosition) <= 10) {
          return
        }
        previousScrollPositionRef.current = currentScrollPosition
        setVisible(
          previousScrollPosition > currentScrollPosition ||
            currentScrollPosition < 10,
        )
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return visible
}
