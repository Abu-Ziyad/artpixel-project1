checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getUser();
    const headerAvatar = document.getElementById('header-avatar');
    if (headerAvatar) {
        headerAvatar.src = currentUser.avatar.replace(/150/g, '40');
    }

    document.getElementById('create-pin-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const imageUrl = document.getElementById('image-url').value;
        const description = document.getElementById('description').value;

        try {
            new URL(imageUrl);
            if (imageUrl && description) {
                addPin({ imageUrl, description });
                alert('تم نشر الصورة بنجاح!');
                window.location.href = 'index.html';
            }
        } catch (_) {
            alert('الرجاء إدخال رابط صحيح للصورة.');
        }
    });
});