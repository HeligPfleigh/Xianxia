import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content/novels')

export interface Chapter {
  number: number
  title: string
  subtitle: string
  readMinutes: number
  content: string
}

export interface Novel {
  slug: string
  title: string
  author: string
  genre: string
  badge?: string
  description: string
  coverImage: string
  chapters: Chapter[]
}

export function getAllNovels(): Novel[] {
  if (!fs.existsSync(contentDirectory)) return []
  
  const slugs = fs.readdirSync(contentDirectory).filter(file => {
    return fs.statSync(path.join(contentDirectory, file)).isDirectory()
  })

  return slugs.map(slug => getNovelBySlug(slug)).filter(Boolean) as Novel[]
}

export function getNovelBySlug(slug: string): Novel | undefined {
  const novelDir = path.join(contentDirectory, slug)
  const metaPath = path.join(novelDir, 'index.json')

  if (!fs.existsSync(metaPath)) return undefined

  const metaContent = fs.readFileSync(metaPath, 'utf8')
  const metadata = JSON.parse(metaContent)

  // Get chapters
  const files = fs.readdirSync(novelDir)
  const chapters: Chapter[] = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fullPath = path.join(novelDir, file)
      const fileContent = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContent)
      const number = parseInt(file.replace('.md', ''))

      return {
        number,
        title: data.title || '',
        subtitle: data.subtitle || '',
        readMinutes: data.readMinutes || 0,
        content: content
      }
    })
    .sort((a, b) => a.number - b.number)

  return {
    slug,
    ...metadata,
    chapters
  }
}

export function getChapter(slug: string, chapterNum: number): Chapter | undefined {
  const novel = getNovelBySlug(slug)
  return novel?.chapters.find(c => c.number === chapterNum)
}
