document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    /**
     * マークダウンテキストを解析し、フロントマターとコンテンツに分割します。
     * @param {string} text - 解析するマークダウンテキスト。
     * @returns {{metadata: object, content: string}} 解析されたメタデータとコンテンツ。
     */
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

    /**
     * コンテンツカードのHTML要素を作成します。
     * @param {object} item - メタデータとコンテンツを含むオブジェクト。
     * @returns {HTMLElement} 作成されたカード要素。
     */
    const createContentCard = (item) => {
        const card = document.createElement('div');
        // 'event-card' クラスを汎用的な 'content-card' に変更し、クリックイベントの対象とします。
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

    /**
     * 指定されたカテゴリのコンテンツを動的に読み込んで表示します。
     * @param {string} category - 読み込むコンテンツのカテゴリ (例: 'events')。
     * @param {string} containerId - コンテンツカードを表示するコンテナのID。
     */
    const loadCategory = async (category, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        let allItems = [];
        let index = 1;
        while (true) {
            const fileNumber = String(index).padStart(3, '0');
            const filePath = `${category}/${fileNumber}.md`;
            
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    // 404 Not Foundなどのエラーの場合はループを終了
                    break;
                }
                const text = await response.text();
                const parsed = parseMarkdown(text);
                if (parsed.metadata.title) { // タイトルがあるものだけを対象とする
                    allItems.push(parsed);
                }
            } catch (error) {
                console.error(`Error fetching file: ${filePath}`, error);
                break;
            }
            index++;
        }

        // 日付の降順でソート（日付がないものは最後に）
        allItems.sort((a, b) => {
            if (!a.metadata.date) return 1;
            if (!b.metadata.date) return -1;
            return new Date(b.metadata.date) - new Date(a.metadata.date);
        });

        // コンテナをクリアしてからカードを追加
        container.innerHTML = ''; 
        allItems.forEach(item => {
            container.appendChild(createContentCard(item));
        });
    };

    // モーダル関連のイベントリスナー
    const mainContainer = document.querySelector('main');
    mainContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.content-card');
        if (card) {
            const title = card.dataset.title;
            // marked.js を使ってMarkdownをHTMLに変換
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

    // 各カテゴリのコンテンツを読み込む
    loadCategory('events', 'events-cards-container');
    loadCategory('news', 'news-cards-container');
    loadCategory('projects', 'projects-cards-container');
});
