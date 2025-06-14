// ** هام جداً: ضع مفتاح Unsplash API الخاص بك هنا **
const UNSPLASH_ACCESS_KEY = 'tRqEm3g6JKDHTAbqzFocedeQvGIrXzwLPjnfl0-z1dE';

// بيانات الصور الافتراضية
const initialImages = [
    { id: 'initial-237', imageUrl: 'https://images.unsplash.com/photo-1507146426996-321341aa1ac5?q=80&w=800', description: 'كلب لطيف يبتسم', author: 'مستخدم افتراضي', avatarUrl: 'https://images.unsplash.com/profile-1507146426996-321341aa1ac5' },
    { id: 'initial-433', imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800', description: 'منظر جبلي خلاب', author: 'مستخدم افتراضي', avatarUrl: 'https://images.unsplash.com/profile-1454496522488-7a8e488e8606' },
    { id: 'initial-577', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d713b20e24d?q=80&w=800', description: 'قهوة صباحية مع كتاب', author: 'مستخدم افتراضي', avatarUrl: 'https://images.unsplash.com/profile-1495474472287-4d713b20e24d' },
    { id: 'initial-1025', imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800', description: 'كلب من فصيلة البج', author: 'مستخدم افتراضي', avatarUrl: 'https://images.unsplash.com/profile-1534361960057-19889db9621e' }
];

// بيانات المستخدم الافتراضية
const defaultUser = { name: 'زائر', handle: '@visitor', avatar: 'https://i.pravatar.cc/150?u=default', savedPinIds: [] };

// --- دوال إدارة البيانات ---

// دالة لجلب كل الصور (من localStorage أو البيانات الأولية)
function getAllPins() {
    const storedPins = localStorage.getItem('artpixelPins_gh');
    if (storedPins) return JSON.parse(storedPins);
    localStorage.setItem('artpixelPins_gh', JSON.stringify(initialImages));
    return initialImages;
}

// *** دالة جديدة ومهمة لحفظ بيانات الصورة إذا لم تكن موجودة ***
function savePinDataIfNotExists(pinObject) {
    const allPins = getAllPins();
    const exists = allPins.some(p => p.id === pinObject.id);
    if (!exists) {
        allPins.unshift(pinObject);
        localStorage.setItem('artpixelPins_gh', JSON.stringify(allPins));
    }
}

// دالة لإضافة صورة جديدة (عند النشر)
function addPin(pinData) {
    const allPins = getAllPins();
    const currentUser = getUser();
    const newPin = {
        id: `local-${Date.now()}`,
        imageUrl: pinData.imageUrl,
        description: pinData.description,
        author: currentUser.name,
        avatarUrl: currentUser.avatar,
        sourceName: new URL(pinData.imageUrl).hostname,
        sourceUrl: pinData.imageUrl
    };
    allPins.unshift(newPin);
    localStorage.setItem('artpixelPins_gh', JSON.stringify(allPins));
    return newPin;
}

// دالة لجلب بيانات المستخدم
function getUser() {
    const storedUser = localStorage.getItem('artpixelUser_gh');
    return storedUser ? JSON.parse(storedUser) : defaultUser;
}

// دالة لحفظ بيانات المستخدم
function saveUser(userData) {
    localStorage.setItem('artpixelUser_gh', JSON.stringify(userData));
}

// دالة للتحقق إذا كان المستخدم مسجل دخوله
function checkAuth() {
    const isAuthPage = window.location.pathname.endsWith('login.html');
    if (!localStorage.getItem('artpixelUser_gh') && !isAuthPage) {
        window.location.href = 'login.html';
    }
}