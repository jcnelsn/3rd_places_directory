// Store events in localStorage
let events = JSON.parse(localStorage.getItem('events')) || [];

// At the top of the file, add:
let upvotedEvents = new Set(); // Track upvoted events
let currentFilter = 'all';
let sortDirection = 'desc'; // Track sort direction

// DOM Elements
const modal = document.getElementById('eventModal');
const addEventBtn = document.getElementById('addEventBtn');
const closeBtn = document.querySelector('.close');
const eventForm = document.getElementById('eventForm');
const eventsContainer = document.querySelector('.events-container');
const sortBtn = document.getElementById('sortBtn');
let isDateAscending = false;

console.log('Container:', eventsContainer); // Should not be null
console.log('Events:', events); // Should show array of events

// Show modal when user clicks "Add Event" button
addEventBtn.onclick = () => {
    modal.classList.add('show');
};

// Hide modal when user clicks close button
closeBtn.onclick = () => {
    modal.classList.remove('show');
};

// Hide modal on outside click
window.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
};

// Handle form submission
eventForm.onsubmit = (e) => {
    e.preventDefault();
    
    const newEvent = {
        id: Date.now(),
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        location: document.getElementById('eventLocation').value,
        startTime: document.getElementById('eventStart').value,
        endTime: document.getElementById('eventEnd').value,
        upvotes: 0,
        timestamp: new Date().toISOString()
    };

    // Push event to local storage array
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    
    // Re-render events
    renderEvents();

    // Clear form and hide modal
    eventForm.reset();
    modal.classList.remove('show');
};

// Render events sorted by upvotes
function renderEvents() {
    let filteredEvents = events;
    
    // Apply filter
    if (currentFilter !== 'all') {
        filteredEvents = events.filter(event => {
            const eventDate = new Date(event.startTime);
            switch (currentFilter) {
                case 'today':
                    return isToday(eventDate);
                case 'tomorrow':
                    return isTomorrow(eventDate);
                case 'weekend':
                    return isThisWeekend(eventDate);
                case 'week':
                    return isThisWeek(eventDate);
                default:
                    return true;
            }
        });
    }
    
    // Apply sort
    if (sortBtn.classList.contains('date-sort')) {
        filteredEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    } else {
        filteredEvents.sort((a, b) => b.upvotes - a.upvotes);
    }
    
    // Generate HTML
    eventsContainer.innerHTML = filteredEvents.map(event => `
        <div class="event-card" data-start-time="${event.startTime}">
            <div class="upvote-section">
                <button class="upvote-btn ${upvotedEvents.has(event.id) ? 'upvoted' : ''}" 
                        onclick="upvoteEvent(${event.id})"
                        data-event-id="${event.id}">
                    <svg width="22" height="19" viewBox="0 0 22 19" fill="${upvotedEvents.has(event.id) ? 'var(--primary-color)' : 'none'}" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.3755 5.1455L16.0956 7.59592C15.5975 6.29824 15.3484 5.64941 14.9715 5.22851C14.6534 4.86878 14.2519 4.59246 13.8023 4.42372C13.3527 4.25498 12.8686 4.19894 12.3923 4.26052C11.8445 4.33476 11.2591 4.67088 10.0866 5.34162L6.68275 7.46017L4.80132 2.55887C4.45513 1.65703 3.46465 1.19746 2.58709 1.53433C1.71139 1.87048 1.28096 2.87548 1.62714 3.77732L4.64819 11.6474C5.59069 14.1027 6.06231 15.3313 6.87804 16.1086C7.7125 16.9033 8.79582 17.3853 9.94477 17.4732C11.0673 17.5597 12.295 17.0884 14.7512 16.1456C16.1245 15.6184 16.8107 15.355 17.337 14.8788C17.4988 14.731 17.6477 14.5703 17.7839 14.3966C18.2218 13.8354 18.4447 13.1211 18.8886 11.691L20.4916 6.5383C20.6073 6.16038 20.594 5.75466 20.4537 5.38514C20.3134 5.01561 20.0541 4.7033 19.7167 4.49743C19.5226 4.37771 19.3059 4.29934 19.0802 4.26721C18.8544 4.23509 18.6245 4.24991 18.4047 4.31074C18.1849 4.37157 17.9801 4.47711 17.803 4.62075C17.6259 4.76438 17.4803 4.94303 17.3755 5.1455Z" 
                        stroke="${upvotedEvents.has(event.id) ? 'var(--primary-color)' : 'currentColor'}" 
                        stroke-width="1.5" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"/>
                    </svg>
                </button>
                <span>${event.upvotes}</span>
            </div>
            <div class="event-details">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(event.startTime)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Increase event upvote count
function upvoteEvent(id) {
    const event = events.find(e => e.id === id);
    if (event) {
        const button = document.querySelector(`[data-event-id="${id}"]`);
        
        if (upvotedEvents.has(id)) {
            // Un-upvote
            event.upvotes--;
            upvotedEvents.delete(id);
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents();
        } else {
            // Upvote with animation
            event.upvotes++;
            upvotedEvents.add(id);
            
            // Add both classes immediately
            button.classList.add('upvoted', 'animate-shaka');
            
            // Wait for animation to complete before re-rendering
            setTimeout(() => {
                button.classList.remove('animate-shaka');
                localStorage.setItem('events', JSON.stringify(events));
                renderEvents();
            }, 600);
        }
    }
}

// Format date/time for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

// Add example events if none exist
if (events.length === 0) {
    const exampleEvents = [
        {
            id: Date.now(),
            title: "Coffee Cupping at Morning Glass",
            description: "Join us for an intimate coffee tasting experience. Learn about different coffee regions, processing methods, and brewing techniques. Limited to 12 participants.",
            location: "Morning Glass Coffee, Manoa",
            startTime: "2024-01-25T09:00",
            endTime: "2024-01-25T10:30",
            upvotes: 15,
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 1,
            title: "Board Game Night at Gathering Place",
            description: "Weekly board game meetup. We have a huge collection of games, from party games to complex strategy games. Beginners welcome! Food and drinks available for purchase.",
            location: "The Gathering Place, Kaimuki",
            startTime: "2024-01-26T18:00",
            endTime: "2024-01-26T22:00",
            upvotes: 23,
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            title: "Poetry Reading at BookEnds",
            description: "Local poets share their latest works. Open mic session follows the featured readers. Wine and light pupus provided.",
            location: "BookEnds, Kailua",
            startTime: "2024-01-27T19:00",
            endTime: "2024-01-27T21:00",
            upvotes: 8,
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 3,
            title: "Vinyl Night at Record Shop",
            description: "Bring your favorite records to share or just come listen! This month's theme: Hawaiian Music Through the Decades. BYOB welcome.",
            location: "Hungry Ear Records, Kaka'ako",
            startTime: "2024-01-28T18:30",
            endTime: "2024-01-28T22:00",
            upvotes: 19,
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 4,
            title: "Watercolor Workshop",
            description: "Learn basic watercolor techniques while painting tropical flowers. All materials provided. Perfect for beginners!",
            location: "Art Explorium, Diamond Head",
            startTime: "2024-01-29T14:00",
            endTime: "2024-01-29T16:00",
            upvotes: 12,
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 5,
            title: "Local Author Book Signing",
            description: "Meet acclaimed local author Sarah Chen as she discusses and signs her new novel 'Pacific Tides'. Books available for purchase.",
            location: "Da Shop, Kaimuki",
            startTime: "2024-01-30T17:00",
            endTime: "2024-01-30T19:00",
            upvotes: 7,
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 6,
            title: "Open Mic Comedy Night",
            description: "Try out your comedy chops or just enjoy the show! Sign-up starts at 7:30. First-timers encouraged!",
            location: "Hawaiian Brian's, Pawaa",
            startTime: "2024-01-31T20:00",
            endTime: "2024-01-31T23:00",
            upvotes: 31,
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 7,
            title: "Sustainable Living Workshop",
            description: "Learn practical tips for reducing waste and living more sustainably in Hawaii. Includes composting demo and free starter kit.",
            location: "Protea Zero Waste, Kaimuki",
            startTime: "2024-02-01T10:00",
            endTime: "2024-02-01T12:00",
            upvotes: 25,
            timestamp: new Date().toISOString()
        }
    ];

    // Add example events to storage
    events = exampleEvents;
    localStorage.setItem('events', JSON.stringify(events));
}

// Then call renderEvents() after
renderEvents();

// Add these helper functions
function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function isTomorrow(date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
}

function isThisWeekend(date) {
    const today = new Date();
    const friday = new Date(today);
    const sunday = new Date(today);
    
    // Adjust to next Friday if we're past Sunday
    friday.setDate(today.getDate() + (5 - today.getDay() + 7) % 7);
    sunday.setDate(friday.getDate() + 2);
    
    return date >= friday && date <= sunday;
}

function isThisWeek(date) {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return date >= today && date <= nextWeek;
}

// Add filter button click handlers
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update filter and re-render
        currentFilter = btn.dataset.filter;
        renderEvents();
    });
});

// Update sort button click handler
sortBtn.addEventListener('click', () => {
    if (!sortBtn.classList.contains('date-sort')) {
        // Switch to date sort
        sortBtn.classList.add('date-sort');
        sortBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
            </svg>
            Sort by Date
        `;
        sortByDate();
    } else {
        // Switch to trending sort
        sortBtn.classList.remove('date-sort');
        sortBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
            </svg>
            Sort by Trending
        `;
        sortByTrending();
    }
});

function sortByDate() {
    events.sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        return dateA - dateB; // Always show soonest first
    });
    renderEvents();
}

function sortByTrending() {
    events.sort((a, b) => b.upvotes - a.upvotes); // Most upvotes first
    renderEvents();
}

// Initial render
sortByTrending(); // Start with trending sort 