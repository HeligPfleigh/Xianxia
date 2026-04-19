import { crawlChapters, crawlChapterContent } from './crawl';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function translateChapter(title: string, content: string) {
    const prompt = `
        You are a professional translator specializing in Chinese web novels. 
        Translate the following chapter from Chinese to Vietnamese.
        The translation should be natural, capturing the tone and nuances of the original text.
        
        Chapter Title: ${title}
        
        Content:
        ${content}
        
        Provide the translation in this format:
        Title: [Translated Title]
        ---
        [Translated Content]
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    
    return response.text;
}

const FISRT_CHAPTER = 584;

async function checkMissing() {
    const slug = 'vot-thi-nhan';
    const url = 'https://www.piaotia.com/html/15/15679/';
    const contentDir = path.join(process.cwd(), 'content/novels', slug);

    if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
    }

    console.log(`Checking missing chapters for ${slug}...`);
    
    // Get crawled chapters
    const crawledChapters = (await crawlChapters(url)).filter(ch => ch.number >= FISRT_CHAPTER);

    if (!crawledChapters || crawledChapters.length === 0) {
        console.log(`No chapters found matching the criteria (>=${FISRT_CHAPTER}).`);
        return;
    }

    // Get local chapters
    let localChapters: number[] = [];
    const files = fs.readdirSync(contentDir);
    localChapters = files
        .filter(f => f.endsWith('.md'))
        .map(f => parseInt(f.replace('.md', '')))
        .filter(n => !isNaN(n));

    const missing = crawledChapters.filter(ch => !localChapters.includes(ch.number));

    console.log(`Summary for ${slug}:`);
    console.log(`- Crawled chapters (>=${FISRT_CHAPTER}): ${crawledChapters.length}`);
    console.log(`- Local chapters: ${localChapters.length}`);
    console.log(`- Missing chapters: ${missing.length}`);

    if (missing.length > 0) {
        console.log(`\nTranslating ${Math.min(missing.length, 5)} chapters (limiting to 5 for test)...`);
        
        for (const ch of missing) {
            console.log(`Processing Chapter ${ch.number}: ${ch.url}...`);
            
            const rawContent = await crawlChapterContent(ch.url);
            if (!rawContent) {
                console.error(`Skipping chapter ${ch.number} due to crawl failure.`);
                continue;
            }

            try {
                const translated = await translateChapter(ch.title, rawContent);
                
                // Parse translated result (expecting Title: ... \n --- \n Content)
                const parts = (translated ?? "").split('---');
                const translatedTitle = parts[0].replace('Title:', '').trim();
                const translatedContent = parts.slice(1).join('---').trim();

                const fileContent = `---
title: "${translatedTitle || ch.title}"
subtitle: ""
readMinutes: ${Math.ceil(translatedContent.length / 500)}
---

${translatedContent}`;

                fs.writeFileSync(path.join(contentDir, `${ch.number}.md`), fileContent);
                console.log(`Successfully saved Chapter ${ch.number}.`);
            } catch (error) {
                console.error(`Failed to translate chapter ${ch.number}:`, error);
            }
        }
    }
}

checkMissing().catch(console.error);

