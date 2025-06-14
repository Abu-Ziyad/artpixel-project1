checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-profile-form');
    const usernameInput = document.getElementById('username');
    const avatarUrlInput = document.getElementById('avatar-url');
    const headerAvatar = document.getElementById('header-avatar');
    
    let currentUser = getUser();
    
    usernameInput.value = currentUser.name;
    avatarUrlInput.placeholder = `اتركه فارغًا للحفاظ على الصورة الحالية`;
    headerAvatar.src = currentUser.avatar.replace(/150/g, '40');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        currentUser.name = usernameInput.value.trim();
        currentUser.handle = `@${currentUser.name.toLowerCase().replace(/\s/g, '')}`;
        
        const newAvatarUrl = avatarUrlInput.value.trim();
        if (newAvatarUrl) {
            currentUser.avatar = newAvatarUrl;
        }
        
        saveUser(currentUser);
        alert('تم تحديث الملف الشخصي بنجاح!');
        window.location.href = 'profile.html';
    });
});