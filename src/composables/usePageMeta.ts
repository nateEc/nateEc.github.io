type PageMeta = {
  title: string
  description: string
  path?: string
  robots?: string
}

const baseUrl = 'https://nateec.github.io'

const setNamedMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export const setPageMeta = ({ title, description, path = '/', robots = 'index, follow' }: PageMeta) => {
  const canonicalUrl = `${baseUrl}${path}`
  document.title = title

  setNamedMeta('meta[name="description"]', 'name', 'description', description)
  setNamedMeta('meta[name="robots"]', 'name', 'robots', robots)
  setNamedMeta('meta[property="og:title"]', 'property', 'og:title', title)
  setNamedMeta('meta[property="og:description"]', 'property', 'og:description', description)
  setNamedMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
  setNamedMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
  setNamedMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = canonicalUrl
}
