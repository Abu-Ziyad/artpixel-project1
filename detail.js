checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    // ... نفس تعريفات المتغيرات ...
    const imagePreviewBox = document.querySelector('.image-preview-box');
    const imageDetailsBox = document.querySelector('.image-details-box');
    const headerAvatar = document.getElementById('header-avatar');
    
    let currentUser = getUser();
    headerAvatar.src = currentUser.avatar.replace(/150/g, '40');
    
    const saveIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3H19C20.1046 3 21 3.89543 21 5V21L12 15.6943L3 21V5C3 3.89543 3.89543 3 5 3Z"></path></svg>`;
    const shareIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.1213 11.1213L9.27982 9.27982C8.75432 9.01706 8.35874 8.46884 8.39764 7.84333L8.60236 4.84333C8.65089 4.09333 9.48995 3.66881 10.1252 4.0596L20.4853 10.0596C21.1449 10.4655 21.1449 11.3783 20.4853 11.7842L10.1252 17.7842C9.48995 18.175 8.65089 17.7505 8.60236 17.0005L8.39764 14.0005C8.35874 13.375 8.75432 12.8267 9.27982 12.564L13.1213 10.7225"></path></svg>`;

    const urlParams = new URLSearchParams(window.location.search);
    const pinId = urlParams.get('id');
    const allPins = getAllPins();
    
    // الأولوية للبحث في البيانات المحلية، ثم استخدام بيانات الرابط
    let pinData = allPins.find(p => p.id === pinId);
    if (!pinData) {
        pinData = {
            id: pinId,
            imageUrl: decodeURIComponent(urlParams.get('imageUrl')),
            description: decodeURIComponent(urlParams.get('desc')),
            author: decodeURIComponent(urlParams.get('author')),
            avatarUrl: decodeURIComponent(urlParams.get('avatarUrl'))
        };
    }

    // ... بقية الكود ...
    document.getElementById('save-btn').addEventListener('click', () => { 
        // *** التصحيح هنا أيضاً ***
        savePinDataIfNotExists(pinData);

        const button = document.getElementById('save-btn');
        const savedIds = currentUser.savedPinIds;
        // ... بقية منطق الحفظ كما هو ...
    });
});