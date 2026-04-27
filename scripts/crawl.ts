import * as cheerio from 'cheerio';

export async function crawlChapters(url: string) {
    try {
        // Native fetch call
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extracting links and titles from the 'centent' div
        const chapters: { title: string, url: string, number: number }[] = [];
        $('div.centent a').each((_, el) => {
            const $el = $(el);
            const title = $el.text().trim();
            const href = $el.attr('href');
            
            if (href && title) {
                // Extract numbers from title
                const numbers = title.match(/\d+/g);
                if (numbers) {
                    const number = parseInt(numbers[0]);
                    // Ensure absolute URL
                    const absoluteUrl = new URL(href, url).toString();
                    chapters.push({ title, url: absoluteUrl, number });
                }
            }
        });

        return chapters;
    } catch (error) {
        console.error('Failed to fetch page:', error);
        return [];
    }
}

export async function crawlChaptersXsw() {
    try {
        const url = 'https://m.xsw.tw'
        // Native fetch call
        const response = await fetch(`${url}/1730108/`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();

        const $ = cheerio.load(html);

        // Extracting links and titles from the 'centent' div
        const chapters: { title: string, url: string, number: number }[] = [];
        $('ul.chapter a').each((_, el) => {
            const $el = $(el);
            const title = $el.text().trim();
            const href = $el.attr('href');
            
            if (href && title) {
                // Extract numbers from title
                const numbers = title.match(/\d+/g);
                if (numbers) {
                    const number = parseInt(numbers[0]);
                    // Ensure absolute URL
                    const absoluteUrl = new URL(href, url).toString();
                    chapters.push({ title, url: absoluteUrl, number });
                }
            }
        });

        return chapters;
    } catch (error) {
        console.error('Failed to fetch page:', error);
        return [];
    }
}

export async function crawlChapterContent(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer()
        const decoder = new TextDecoder('gbk'); // or 'gb2312'
        const text = decoder.decode(arrayBuffer);
        const $ = cheerio.load(text);

        // Remove unwanted elements like scripts, ads, etc. if they exist inside content
        $('script').remove();
        $('a').remove(); // Often contains 'Next' or 'Home' links inside content

        const content = $('body').html();
        return content;
    } catch (error) {
        console.error(`Failed to fetch chapter content from ${url}:`, error);
        return null;
    }
}
 