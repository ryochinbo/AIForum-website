document.addEventListener('DOMContentLoaded', () => {
    const eventFiles = [
        'events/001.md',
        'events/002.md'
    ];

    const container = document.getElementById('event-cards-container');
    const viewMoreBtn = document.getElementById('view-more-btn');
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    let allEvents = [];
    let displayedEvents = 0;
    const initialDisplayCount = 3;

    const parseMarkdown = (text) => {
        const parts = text.split('---');
        const frontMatter = parts[0];
        const content = parts.slice(1).join('---');

        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const [key, ...value] = line.split(':');
            if (key) {
                metadata[key.trim()] = value.join(':').trim();
            }
        });

        return { metadata, content };
    };

    const createEventCard = (event) => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.content = event.content;
        card.dataset.title = event.metadata.title;

        card.innerHTML = `
            <h3>${event.metadata.title}</h3>
            <p class="text-gray-600 mb-2"><strong class="text-blue-600">日時:</strong> ${event.metadata.date}</p>
            <p class="text-gray-600 mb-2"><strong class="text-blue-600">場所:</strong> ${event.metadata.location}</p>
            <p class="text-gray-600 mb-4">${event.metadata.summary}</p>
        `;
        return card;
    };

    const renderEvents = () => {
        const eventsToRender = allEvents.slice(displayedEvents, displayedEvents + initialDisplayCount);
        eventsToRender.forEach(event => {
            container.appendChild(createEventCard(event));
        });
        displayedEvents += eventsToRender.length;

        if (displayedEvents >= allEvents.length) {
            viewMoreBtn.style.display = 'none';
        }
    };

    Promise.all(eventFiles.map(file => fetch(file).then(response => response.text())))
        .then(texts => {
            allEvents = texts.map(text => parseMarkdown(text));
            allEvents.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));
            renderEvents();
        });

    viewMoreBtn.addEventListener('click', renderEvents);

    container.addEventListener('click', (e) => {
        const card = e.target.closest('.event-card');
        if (card) {
            const title = card.dataset.title;
            const content = card.dataset.content;
            modalBody.innerHTML = `<h1>${title}</h1>${marked.parse(content)}`;
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
});