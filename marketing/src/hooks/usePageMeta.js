import { useEffect } from 'react'

export function usePageMeta({ title, description, canonical }) {
  useEffect(() => {
    const set = (selector, attr, value) => {
      if (value) document.querySelector(selector)?.setAttribute(attr, value)
    }

    document.title = title
    set('meta[name="description"]',        'content', description)
    set('link[rel="canonical"]',           'href',    canonical)
    set('meta[property="og:title"]',       'content', title)
    set('meta[property="og:description"]', 'content', description)
    set('meta[property="og:url"]',         'content', canonical)
    set('meta[name="twitter:title"]',      'content', title)
    set('meta[name="twitter:description"]','content', description)
  }, [title, description, canonical])
}
