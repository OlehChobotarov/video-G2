document.getElementById('add-video-form').addEventListener('submit', function(e) {
    e.preventDefault();
    addVideo();
});

function deleteVideo(videoId) {
    let videos = JSON.parse(localStorage.getItem('videos')) || [];
    videos = videos.filter(video => video.id !== parseInt(videoId));
    localStorage.setItem('videos', JSON.stringify(videos));
    displayVideos(videos); // Оновити список на сторінці
}

function addVideo() {
    const url = document.getElementById('video-url').value;
    const author = document.getElementById('video-author').value;
    const date = document.getElementById('video-date').value;
    const tags = document.getElementById('video-tags').value.split(',');

    const video = {
        id: Date.now(),
        url: url,
        author: author,
        date: date,
        tags: tags
    };

    let videos = JSON.parse(localStorage.getItem('videos')) || [];
    videos.push(video);
    localStorage.setItem('videos', JSON.stringify(videos));

    displayVideos(videos);
    document.getElementById('add-video-form').reset();
}

function editVideo(videoId) {
    let videos = JSON.parse(localStorage.getItem('videos')) || [];
    const video = videos.find(v => v.id === parseInt(videoId));

    if (video) {
        // Заповнюємо форму даними відео для редагування
        document.getElementById('video-url').value = video.url;
        document.getElementById('video-author').value = video.author;
        document.getElementById('video-date').value = video.date;
        document.getElementById('video-tags').value = video.tags.join(', ');

        // Відкриваємо форму для редагування
        document.getElementById('add-video-form').style.display = 'block';

        // Замінюємо стандартне додавання на збереження змін
        const form = document.getElementById('add-video-form');
        form.onsubmit = function (e) {
            e.preventDefault();
            saveEditedVideo(videoId);
        };
    }
}


function saveEditedVideo(videoId) {
    let videos = JSON.parse(localStorage.getItem('videos')) || [];
    const videoIndex = videos.findIndex(v => v.id === parseInt(videoId));

    if (videoIndex !== -1) {
        // Оновлення даних відео
        videos[videoIndex].url = document.getElementById('video-url').value;
        videos[videoIndex].author = document.getElementById('video-author').value;
        videos[videoIndex].date = document.getElementById('video-date').value;
        videos[videoIndex].tags = document.getElementById('video-tags').value.split(',');

        localStorage.setItem('videos', JSON.stringify(videos));
        displayVideos(videos);

        // Очищаємо та приховуємо форму після редагування
        document.getElementById('add-video-form').reset();
        document.getElementById('add-video-form').style.display = 'none';
    }
}


function displayVideos(videos) {
    const videoList = document.getElementById('video-list');
    videoList.innerHTML = '';

    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';

        const videoContent = video.url.includes('youtube.com') ? `
            <iframe src="${video.url.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe>
        ` : `
            <video controls>
                <source src="${video.url}" type="video/mp4">
                Ваш браузер не підтримує відео тег.
            </video>
        `;

        videoCard.innerHTML = `
            ${videoContent}
            <p>Автор: ${video.author}</p>
            <p>Дата: ${new Date(video.date).toLocaleString()}</p>
            <p class="tags">Теги: ${video.tags.join(', ')}</p>
            <button class="edit-btn" data-id="${video.id}">Редагувати</button>
            <button class="delete-btn" data-id="${video.id}">Видалити</button>
        `;

        videoList.appendChild(videoCard);
    });

    // Додайте обробники подій для кнопок "Видалити"
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            deleteVideo(this.dataset.id);
        });
    });

    // Додайте обробники подій для кнопок "Редагувати"
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            editVideo(this.dataset.id);
        });
    });
}

function searchByTags() {
    const searchTags = document.getElementById('search-tags').value.toLowerCase().split(',').map(tag => tag.trim());
    const videos = JSON.parse(localStorage.getItem('videos')) || [];

    const filteredVideos = videos.filter(video => {
        return video.tags.some(tag => searchTags.includes(tag.toLowerCase()));
    });

    displayVideos(filteredVideos);
}

function resetSearch() {
    document.getElementById('search-tags').value = '';
    displayVideos(JSON.parse(localStorage.getItem('videos')) || []);
}

document.addEventListener('DOMContentLoaded', function() {
    const toggleFormBtn = document.getElementById('toggle-form-btn');
    const addVideoForm = document.getElementById('add-video-form');

    toggleFormBtn.addEventListener('click', function() {
        if (addVideoForm.style.display === 'none') {
            addVideoForm.style.display = 'block';
        } else {
            addVideoForm.style.display = 'none';
        }
    });

    // Відобразити існуючі відео після завантаження сторінки
    const videos = JSON.parse(localStorage.getItem('videos')) || [];
    displayVideos(videos);
});
