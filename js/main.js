document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    /**
     * デバッグメッセージをコンテナに表示します。
     * @param {HTMLElement} container - メッセージを表示するコンテナ要素。
     * @param {string} message - 表示するメッセージ。
     * @param {boolean} isError - エラーメッセージかどうか。
     */
    const logToContainer = (container, message, isError = false) => {
        const p = document.createElement('p');
        p.textContent = message;
        if (isError) {
            p.style.color = 'red';
            p.style.fontWeight = 'bold';
        }
        container.appendChild(p);
    };

    const parseMarkdown = (text) => {
        const parts = text.split('---');
        if (parts.length < 3) {
            return { metadata: {}, content: text };
        }
        const frontMatter = parts[1];
        const content = parts.slice(2).join('---');

        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const [key, ...value] = line.split(':');
            if (key && key.trim()) {
                metadata[key.trim()] = value.join(':').trim();
            }
        });
        return { metadata, content };
    };

    const createContentCard = (item) => {
        const card = document.createElement('div');
        card.className = 'event-card content-card';
        card.dataset.content = item.content;
        card.dataset.title = item.metadata.title || 'No Title';

        card.innerHTML = `
            <h3>${item.metadata.title || 'No Title'}</h3>
            ${item.metadata.date ? `<p class="text-gray-600 mb-2"><strong class="text-blue-600">日時:</strong> ${item.metadata.date}</p>` : ''}
            ${item.metadata.location ? `<p class="text-gray-600 mb-2"><strong class="text-blue-600">場所:</strong> ${item.metadata.location}</p>` : ''}
            ${item.metadata.summary ? `<p class="text-gray-600 mb-4">${item.metadata.summary}</p>` : ''}
        `;
        return card;
    };

    const loadCategory = async (category, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }

        container.innerHTML = ''; // コンテナをクリア
        logToContainer(container, `[${category}] Loading...`);

        let allItems = [];
        let index = 1;
        while (true) {
            const fileNumber = String(index).padStart(3, '0');
            const filePath = `${category}/${fileNumber}.md`;
            
            logToContainer(container, `[${category}] Fetching: ${filePath}...`);

            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    logToContainer(container, `[${category}] ...File not found or error (Status: ${response.status}). Stopping search for this category.`, true);
                    break;
                }
                
                logToContainer(container, `[${category}] ...Success!`);
                const text = await response.text();
                const parsed = parseMarkdown(text);
                if (parsed.metadata.title) {
                    allItems.push(parsed);
                }
            } catch (error) {
                logToContainer(container, `[${category}] ...Fetch failed with a network error: ${error}. Stopping.`, true);
                break;
            }
            index++;
        }

        // カードを生成する前にデバッグメッセージをクリア
        container.innerHTML = '';

        if (allItems.length === 0) {
            logToContainer(container, `[${category}] No items found.`, true);
            return;
        }

        allItems.sort((a, b) => {
            if (!a.metadata.date) return 1;
            if (!b.metadata.date) return -1;
            return new Date(b.metadata.date) - new Date(a.metadata.date);
        });
        
        allItems.forEach(item => {
            container.appendChild(createContentCard(item));
        });
    };

    const mainContainer = document.querySelector('main');
    mainContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.content-card');
        if (card) {
            const title = card.dataset.title;
            const contentHtml = marked.parse(card.dataset.content);
            modalBody.innerHTML = `<h1>${title}</h1>${contentHtml}`;
            modal.style.display = 'block';
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    loadCategory('events', 'events-cards-container');
    loadCategory('news', 'news-cards-container');
    loadCategory('projects', 'projects-cards-container');
});