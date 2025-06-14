checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const headerAvatar = document.getElementById('header-avatar');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    let currentUser = getUser();
    let currentDisplayedPins = []; // لتخزين بيانات الصور المعروضة حالياً

    headerAvatar.src = currentUser.avatar.replace(/150/g, '40');

    function displayPins(pins) {
        currentDisplayedPins = pins; // تحديث قائمة الصور المعروضة
        galleryContainer.innerHTML = '';
        if (!pins || pins.length === 0) {
            galleryContainer.innerHTML = `<p class="gallery-message">لا توجد نتائج. جرب البحث عن شيء آخر.</p>`;
            return;
        }
        pins.forEach(pinData => {
            const linkWrapper = document.createElement('a');
            const imageUrlEncoded = encodeURIComponent(pinData.imageUrl);
            const authorEncoded = encodeURIComponent(pinData.author);
            const avatarUrlEncoded = encodeURIComponent(pinData.avatarUrl || `https://i.pravatar.cc/30?u=${encodeURIComponent(pinData.author)}`);
            linkWrapper.href = `pin-detail.html?id=${pinData.id}&imageUrl=${imageUrlEncoded}&desc=${encodeURIComponent(pinData.description)}&author=${authorEncoded}&avatarUrl=${avatarUrlEncoded}`;
            linkWrapper.classList.add('gallery-item-link');
            
            const item = document.createElement('div');
            item.classList.add('gallery-item');
            
            const isSaved = currentUser.savedPinIds.includes(pinData.id);
            item.innerHTML = `
                <img src="${pinData.imageUrl}" alt="${pinData.description}">
                <div class="card-overlay">
                    <div class="author-info">
                        <img src="${pinData.avatarUrl || `https://i.pravatar.cc/30?u=${encodeURIComponent(pinData.author)}`}" alt="${pinData.author}">
                        <span>${pinData.author}</span>
                    </div>
                    <button class="save-button ${isSaved ? 'saved' : ''}" data-pin-id="${pinData.id}">${isSaved ? 'تم الحفظ' : 'حفظ'}</button>
                </div>
            `;
            linkWrapper.appendChild(item);
            galleryContainer.appendChild(linkWrapper);
        });
    }

    async function searchUnsplash(query) {
        galleryContainer.innerHTML = `<div class="loading-spinner"></div>`;
        if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
            galleryContainer.innerHTML = `<p class="gallery-message">الرجاء إضافة مفتاح Unsplash API في ملف data-manager.js لتفعيل البحث.</p>`;
            return;
        }
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=30&client_id=${UNSPLASH_ACCESS_KEY}`);
            if (!response.ok) throw new Error('فشل الاتصال بالشبكة');
            const data = await response.json();
            const searchResults = data.results.map(photo => ({
                id: photo.id,
                imageUrl: photo.urls.regular,
                description: photo.alt_description || query,
                author: photo.user.name,
                avatarUrl: photo.user.profile_image.small,
            }));
            displayPins(searchResults);
        } catch (error) {
            galleryContainer.innerHTML = `<p class="gallery-message">حدث خطأ أثناء البحث. حاول مرة أخرى.</p>`;
        }
    }

    displayPins(getAllPins());

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) searchUnsplash(searchTerm);
        else displayPins(getAllPins());
    });

    galleryContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('save-button')) {
            event.preventDefault();
            const button = event.target;
            const pinId = button.dataset.pinId;
            const savedIds = currentUser.savedPinIds;
            
            // *** التصحيح هنا: حفظ بيانات الصورة قبل تحديث قائمة الحفظ ***
            const pinToSave = currentDisplayedPins.find(p => p.id === pinId);
            if(pinToSave){
                savePinDataIfNotExists(pinToSave);
            }

            if (savedIds.includes(pinId)) {
                currentUser.savedPinIds = savedIds.filter(id => id !== pinId);
                button.textContent = 'حفظ';
                button.classList.remove('saved');
            } else {
                currentUser.savedPinIds.push(pinId);
                button.textContent = 'تم الحفظ';
                button.classList.add('saved');
            }
            saveUser(currentUser);
        }
    });
});