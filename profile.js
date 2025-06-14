checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    const profileHeader = document.getElementById('profile-header');
    const savedGallery = document.getElementById('saved-gallery-container');
    const myPinsGallery = document.getElementById('my-pins-gallery-container');
    const headerAvatar = document.getElementById('header-avatar');

    const currentUser = getUser();
    const allPins = getAllPins();

    headerAvatar.src = currentUser.avatar.replace(/150/g, '40');

    function renderProfileHeader() {
        profileHeader.innerHTML = `
            <img src="${currentUser.avatar}" alt="${currentUser.name}" class="profile-avatar">
            <h1 class="profile-name">${currentUser.name}</h1>
            <p class="profile-handle">${currentUser.handle}</p>
            <div class="profile-header-actions">
                <a href="edit-profile.html" class="btn-edit-profile">تعديل الملف الشخصي</a>
            </div>
        `;
    }

    function renderGalleries() {
        savedGallery.innerHTML = '';
        myPinsGallery.innerHTML = '';
        
        // الآن هذا الفلتر سيعمل بشكل صحيح
        const savedPinsData = allPins.filter(pin => currentUser.savedPinIds.includes(pin.id));
        const myPinsData = allPins.filter(pin => pin.author === currentUser.name);

        if (savedPinsData.length === 0) { savedGallery.innerHTML = '<p class="gallery-message">لم تقم بحفظ أي صور بعد.</p>'; } 
        else { savedPinsData.forEach(pinData => createPinCard(pinData, savedGallery)); }

        if (myPinsData.length === 0) { myPinsGallery.innerHTML = '<p class="gallery-message">لم تقم بنشر أي صور بعد.</p>'; } 
        else { myPinsData.forEach(pinData => createPinCard(pinData, myPinsGallery)); }
    }

    function createPinCard(pinData, container) {
        const linkWrapper = document.createElement('a');
        const imageUrlEncoded = encodeURIComponent(pinData.imageUrl);
        const authorEncoded = encodeURIComponent(pinData.author);
        const avatarUrlEncoded = encodeURIComponent(pinData.avatarUrl || `https://i.pravatar.cc/30?u=${encodeURIComponent(pinData.author)}`);
        linkWrapper.href = `pin-detail.html?id=${pinData.id}&imageUrl=${imageUrlEncoded}&desc=${encodeURIComponent(pinData.description)}&author=${authorEncoded}&avatarUrl=${avatarUrlEncoded}`;
        linkWrapper.classList.add('gallery-item-link');
        
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.innerHTML = `<img src="${pinData.imageUrl}" alt="${pinData.description}">`;
        linkWrapper.appendChild(item);
        container.appendChild(linkWrapper);
    }

    renderProfileHeader();
    renderGalleries();
});