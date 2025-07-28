// Blog Parser - Markdown to HTML Converter
class BlogParser {
    constructor() {
        this.markdownRules = [
            // Headers
            { pattern: /^### (.*$)/gim, replacement: '<h3>$1</h3>' },
            { pattern: /^## (.*$)/gim, replacement: '<h2>$1</h2>' },
            { pattern: /^# (.*$)/gim, replacement: '<h1>$1</h1>' },
            
            // Bold and italic
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
            { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
            
            // Strikethrough
            { pattern: /~~(.*?)~~/g, replacement: '<del>$1</del>' },
            
            // Links
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" target="_blank" rel="noopener">$1</a>' },
            
            // Code blocks with copy functionality
            { pattern: /```(\w+)?\n([\s\S]*?)```/g, replacement: (match, lang, code) => {
                const language = lang || 'text';
                const escapedCode = this.escapeHtml(code.trim());
                return `<div class="code-block-wrapper">
                    <div class="code-header">
                        <span class="code-language">${language}</span>
                        <button class="copy-btn" onclick="copyCode(this)" data-code="${escapedCode}">
                            <i class="fas fa-copy"></i> Kopyala
                        </button>
                    </div>
                    <pre><code class="language-${language}">${escapedCode}</code></pre>
                </div>`;
            }},
            
            // Inline code with copy functionality
            { pattern: /`([^`]+)`/g, replacement: (match, code) => {
                const escapedCode = this.escapeHtml(code);
                return `<code class="inline-code" onclick="copyInlineCode(this)" data-code="${escapedCode}">${escapedCode}</code>`;
            }},
            
            // Lists
            { pattern: /^\* (.*$)/gim, replacement: '<li>$1</li>' },
            { pattern: /^- (.*$)/gim, replacement: '<li>$1</li>' },
            { pattern: /^\d+\. (.*$)/gim, replacement: '<li>$1</li>' },
            
            // Blockquotes
            { pattern: /^> (.*$)/gim, replacement: '<blockquote>$1</blockquote>' },
            
            // Horizontal rules
            { pattern: /^---$/gim, replacement: '<hr>' },
            
            // Paragraphs (but not for tables or other block elements)
            { pattern: /^([^<].*)$/gm, replacement: '<p>$1</p>' }
        ];
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Parse tables
    parseTables(markdown) {
        const lines = markdown.split('\n');
        const result = [];
        let inTable = false;
        let tableRows = [];
        let tableHeaders = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if this is a table row
            if (line.startsWith('|') && line.endsWith('|')) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                
                // Parse table row
                const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
                tableRows.push(cells);
                
                // Check if next line is separator
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine.match(/^\|[\s\-\|:]+\|$/)) {
                        // This is a separator line, skip it
                        i++;
                        continue;
                    }
                }
            } else {
                if (inTable) {
                    // End of table, render it
                    result.push(this.renderTable(tableRows));
                    inTable = false;
                    tableRows = [];
                }
                result.push(lines[i]);
            }
        }

        // Handle table at the end
        if (inTable) {
            result.push(this.renderTable(tableRows));
        }

        return result.join('\n');
    }

    // Render table HTML
    renderTable(rows) {
        if (rows.length === 0) return '';

        let html = '<div class="table-wrapper"><table class="markdown-table">';
        
        // Add header
        if (rows.length > 0) {
            html += '<thead><tr>';
            rows[0].forEach(cell => {
                html += `<th>${this.escapeHtml(cell)}</th>`;
            });
            html += '</tr></thead>';
        }

        // Add body
        if (rows.length > 1) {
            html += '<tbody>';
            for (let i = 1; i < rows.length; i++) {
                html += '<tr>';
                rows[i].forEach(cell => {
                    html += `<td>${this.escapeHtml(cell)}</td>`;
                });
                html += '</tr>';
            }
            html += '</tbody>';
        }

        html += '</table></div>';
        return html;
    }

    parseFrontmatter(content) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!frontmatterMatch) {
            return { metadata: {}, content: content };
        }

        const frontmatter = frontmatterMatch[1];
        const markdownContent = frontmatterMatch[2];

        const metadata = {};
        frontmatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                // Parse arrays
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
                }
                
                metadata[key] = value;
            }
        });

        return { metadata, content: markdownContent };
    }

    markdownToHtml(markdown) {
        let html = markdown;

        // Parse tables first
        html = this.parseTables(html);

        // Apply markdown rules
        this.markdownRules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replacement);
        });

        // Wrap lists properly
        html = this.wrapLists(html);

        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');

        return html;
    }

    wrapLists(html) {
        // Find consecutive <li> elements and wrap them in <ul> or <ol>
        const lines = html.split('\n');
        const result = [];
        let inList = false;
        let listType = 'ul';
        let listItems = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('<li>')) {
                if (!inList) {
                    inList = true;
                    listItems = [];
                }
                listItems.push(line);
            } else {
                if (inList) {
                    // Close the list
                    result.push(`<${listType}>`);
                    result.push(...listItems);
                    result.push(`</${listType}>`);
                    inList = false;
                    listItems = [];
                }
                result.push(line);
            }
        }

        // Handle list at the end
        if (inList) {
            result.push(`<${listType}>`);
            result.push(...listItems);
            result.push(`</${listType}>`);
        }

        return result.join('\n');
    }

    parse(markdownContent) {
        const { metadata, content } = this.parseFrontmatter(markdownContent);
        const htmlContent = this.markdownToHtml(content);
        
        return {
            ...metadata,
            content: htmlContent,
            slug: this.generateSlug(metadata.title || '')
        };
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Copy functions for code blocks
function copyCode(button) {
    const code = button.getAttribute('data-code');
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
        button.style.background = '#10b981';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Kopyalama başarısız:', err);
        button.innerHTML = '<i class="fas fa-times"></i> Hata!';
        button.style.background = '#ef4444';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Kopyala';
            button.style.background = '';
        }, 2000);
    });
}

function copyInlineCode(codeElement) {
    const code = codeElement.getAttribute('data-code');
    navigator.clipboard.writeText(code).then(() => {
        const originalText = codeElement.textContent;
        codeElement.textContent = 'Kopyalandı!';
        codeElement.style.background = '#10b981';
        codeElement.style.color = 'white';
        setTimeout(() => {
            codeElement.textContent = originalText;
            codeElement.style.background = '';
            codeElement.style.color = '';
        }, 1500);
    }).catch(err => {
        console.error('Kopyalama başarısız:', err);
        codeElement.textContent = 'Hata!';
        codeElement.style.background = '#ef4444';
        codeElement.style.color = 'white';
        setTimeout(() => {
            codeElement.textContent = code;
            codeElement.style.background = '';
            codeElement.style.color = '';
        }, 1500);
    });
}

class BlogLoader {
    constructor() {
        this.parser = new BlogParser();
        this.blogPosts = [];
        this.postsPerPage = 5;
        this.currentPage = 1;
        this.totalPages = 0;
        this.currentPost = null; // For single post view
    }

    async loadBlogPosts() {
        try {
            console.log('Scanning _posts directory for markdown files...');
            
            // Try to get directory listing from _posts folder
            const posts = await this.scanPostsDirectory();
            
            if (posts.length === 0) {
                console.log('No markdown files found in _posts directory');
                this.blogPosts = [];
                this.totalPages = 0;
                return;
            }

            // Sort posts by date (newest first)
            this.blogPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.totalPages = Math.ceil(this.blogPosts.length / this.postsPerPage);
            
            console.log(`Loaded ${this.blogPosts.length} blog posts, total pages: ${this.totalPages}`);
            
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.blogPosts = [];
            this.totalPages = 0;
        }
    }

    async scanPostsDirectory() {
        try {
            // Try to fetch a directory listing or index file
            const response = await fetch('_posts/');
            
            if (response.ok) {
                const html = await response.text();
                // Parse the directory listing to find .md files
                const mdFiles = this.extractMarkdownFiles(html);
                return await this.loadMarkdownFiles(mdFiles);
            } else {
                // Fallback: try to get a list of known files
                console.log('Directory listing not available, using fallback method');
                return await this.loadKnownFiles();
            }
        } catch (error) {
            console.log('Error scanning directory, using fallback method:', error);
            return await this.loadKnownFiles();
        }
    }

    extractMarkdownFiles(html) {
        // Extract .md files from directory listing HTML
        const mdFileRegex = /href="([^"]*\.md)"/g;
        const files = [];
        let match;
        
        while ((match = mdFileRegex.exec(html)) !== null) {
            files.push(match[1]);
        }
        
        console.log('Found markdown files:', files);
        return files;
    }

    async loadMarkdownFiles(files) {
        const posts = [];
        
        for (const file of files) {
            try {
                console.log(`Loading blog post: ${file}`);
                const response = await fetch(`_posts/${file}`);
                
                if (!response.ok) {
                    console.error(`Failed to load ${file}: ${response.status}`);
                    continue;
                }

                const markdownContent = await response.text();
                console.log(`Successfully loaded ${file}, content length: ${markdownContent.length}`);
                
                const parsedPost = this.parser.parse(markdownContent);
                posts.push(parsedPost);
                
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        }
        
        return posts;
    }

    async loadKnownFiles() {
        // Fallback method: manually specify files if directory scanning fails
        const knownFiles = [
            'lisans-secimi.md',
            'devops-pipeline.md'
        ];

        return await this.loadMarkdownFiles(knownFiles);
    }

    getPostsForPage(page) {
        const startIndex = (page - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        return this.blogPosts.slice(startIndex, endIndex);
    }

    renderBlogPosts(page = 1) {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        // Clear loading state
        blogGrid.innerHTML = '';

        if (this.blogPosts.length === 0) {
            blogGrid.innerHTML = `
                <div class="blog-empty">
                    <i class="fas fa-newspaper"></i>
                    <h3>Henüz blog yazısı yok</h3>
                    <p>_posts klasörüne Markdown dosyaları ekleyin</p>
                </div>
            `;
            return;
        }

        const postsForPage = this.getPostsForPage(page);
        
        postsForPage.forEach(post => {
            const blogCard = this.createBlogCard(post);
            blogGrid.appendChild(blogCard);
        });

        this.renderPagination();
    }

    renderSinglePost(slug) {
        const post = this.blogPosts.find(p => p.slug === slug);
        if (!post) {
            console.error(`Post not found: ${slug}`);
            return;
        }

        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        blogGrid.innerHTML = `
            <article class="blog-post-full">
                <div class="blog-post-header">
                    <div class="blog-post-meta">
                        <span class="blog-category">${post.category || 'Genel'}</span>
                        <span class="blog-date">${this.parser.formatDate(post.date)}</span>
                        <span class="blog-author">${post.author}</span>
                        <span class="blog-reading-time">${post.reading_time}</span>
                    </div>
                    
                    <h1 class="blog-post-title">${post.title}</h1>
                    
                    <p class="blog-post-excerpt">${post.excerpt}</p>
                    
                    <div class="blog-post-tags">
                        ${Array.isArray(post.tags) ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                </div>
                
                <div class="blog-post-content">
                    ${post.content}
                </div>
                
                <div class="blog-post-footer">
                    <div class="share-buttons">
                        <h4>Bu yazıyı paylaş:</h4>
                        <a href="#" class="share-btn twitter">
                            <i class="fab fa-twitter"></i> Twitter
                        </a>
                        <a href="#" class="share-btn linkedin">
                            <i class="fab fa-linkedin"></i> LinkedIn
                        </a>
                        <a href="#" class="share-btn facebook">
                            <i class="fab fa-facebook"></i> Facebook
                        </a>
                    </div>
                    
                    <a href="#" class="back-to-blog" onclick="blogLoader.showBlogList()">
                        <i class="fas fa-arrow-left"></i> Blog'a Dön
                    </a>
                </div>
            </article>
        `;

        // Hide pagination for single post view
        const paginationContainer = document.querySelector('.blog-pagination');
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
    }

    showBlogList() {
        // Update URL to remove post slug
        window.history.pushState({}, '', 'blog.html');
        
        // Show pagination again
        const paginationContainer = document.querySelector('.blog-pagination');
        if (paginationContainer) {
            paginationContainer.style.display = 'block';
        }
        
        // Render blog list
        this.renderBlogPosts(this.currentPage);
    }

    renderPagination() {
        const paginationContainer = document.querySelector('.blog-pagination');
        if (!paginationContainer || this.totalPages <= 1) {
            return;
        }

        let paginationHTML = '<div class="pagination-controls">';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="btn-pagination" onclick="blogLoader.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Önceki
            </button>`;
        }

        // Page numbers
        for (let i = 1; i <= this.totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<span class="btn-pagination active">${i}</span>`;
            } else {
                paginationHTML += `<button class="btn-pagination" onclick="blogLoader.goToPage(${i})">${i}</button>`;
            }
        }

        // Next button
        if (this.currentPage < this.totalPages) {
            paginationHTML += `<button class="btn-pagination" onclick="blogLoader.goToPage(${this.currentPage + 1})">
                Sonraki <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        paginationHTML += '</div>';
        
        // Page info
        paginationHTML += `<div class="pagination-info">
            Sayfa ${this.currentPage} / ${this.totalPages} 
            (Toplam ${this.blogPosts.length} yazı)
        </div>`;

        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.renderBlogPosts(page);
        }
    }

    createBlogCard(post) {
        const card = document.createElement('article');
        card.className = 'blog-card';
        
        const formattedDate = this.parser.formatDate(post.date);
        const tags = Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '';
        
        card.innerHTML = `
            <div class="blog-card-header">
                <div class="blog-meta">
                    <span class="blog-category">${post.category || 'Genel'}</span>
                    <span class="blog-date">${formattedDate}</span>
                </div>
                ${post.featured ? '<span class="blog-featured">Öne Çıkan</span>' : ''}
            </div>
            
            <div class="blog-card-content">
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                
                <div class="blog-tags">
                    ${tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                </div>
            </div>
            
            <div class="blog-card-footer">
                <div class="blog-author">
                    <i class="fas fa-user"></i>
                    <span>${post.author}</span>
                </div>
                <div class="blog-reading-time">
                    <i class="fas fa-clock"></i>
                    <span>${post.reading_time}</span>
                </div>
                <a href="#" class="read-more" onclick="blogLoader.showPost('${post.slug}')">
                    Devamını Oku <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        return card;
    }

    showPost(slug) {
        // Update URL with post slug
        window.history.pushState({}, '', `blog.html?post=${slug}`);
        
        // Render the single post
        this.renderSinglePost(slug);
    }

    // Check URL parameters on page load
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get('post');
        
        if (postSlug) {
            this.showPost(postSlug);
        } else {
            this.renderBlogPosts(1);
        }
    }
}

// Initialize blog loader when DOM is loaded
let blogLoader;
document.addEventListener('DOMContentLoaded', async () => {
    blogLoader = new BlogLoader();
    await blogLoader.loadBlogPosts();
    blogLoader.checkUrlParams();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    if (blogLoader) {
        blogLoader.checkUrlParams();
    }
}); 