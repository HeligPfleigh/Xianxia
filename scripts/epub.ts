import EzEPUB, { Options } from 'epub-gen-memory';
import MarkdownIt from 'markdown-it';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter'

async function createEpubFromList() {
    const md = new MarkdownIt();
    const slug = 'vot-thi-nhan'
    const novelDir = path.join(process.cwd(), 'content/novels', slug)
    const metaPath = path.join(novelDir, 'index.json')
    const files = fs.readdirSync(novelDir)
    const metaContent = fs.readFileSync(metaPath, 'utf8')
    const metadata = JSON.parse(metaContent)
    
    // 1. Map the list of files to the EPUB chapter format
    const content = files.filter(file => file.endsWith('.md')).map((filePath) => {
        const fileContent = fs.readFileSync(path.join(novelDir, filePath), 'utf8')
        const { data, content } = matter(fileContent)

        return {
            title: data.title,
            content: md.render(content)
        };
    });

    // 2. Metadata for the book
    const options: Options = {
        title: metadata.title,
        author: metadata.author,
        publisher: "myself",
        cover: path.join(process.cwd(), 'public', 'covers', `${slug}.png`),
        lang: 'vi'
    };

    try {
        const epubBuffer = await EzEPUB(options, content);
        writeFileSync(path.join(process.cwd(), 'public', `${slug}.epub`), epubBuffer);
        console.log(`✅ EPUB generated successfully with ${content.length} chapters.`);
    } catch (error) {
        console.error("❌ Error:", error);
    }
}



createEpubFromList();