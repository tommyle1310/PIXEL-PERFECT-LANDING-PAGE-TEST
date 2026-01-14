function updateEstimatedShipDate() {
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const today = new Date();
    const shipDate = new Date(today);
    shipDate.setDate(today.getDate() + 5);
    
    const dayOfWeek = daysOfWeek[shipDate.getDay()];
    const day = shipDate.getDate();
    const month = shipDate.getMonth() + 1; // Months are 0-indexed
    
    const formattedDate = `${dayOfWeek}, ${day} Tháng ${month}`;
    
    const element = document.getElementById('estimated-ship-time');
    if (element) {
        element.textContent = formattedDate;
    }
}

// Character counter for review textarea
function initCharacterCounter() {
    const MAX_CHARS = 5000;
    const textarea = document.getElementById('content-textarea');
    const counter = document.getElementById('char-counter');
    
    if (!textarea || !counter) return;
    
    textarea.setAttribute('maxlength', MAX_CHARS);
    
    textarea.addEventListener('input', function() {
        const remaining = MAX_CHARS - this.value.length;
        
        if (this.value.length === 0) {
            counter.classList.add('hidden');
        } else {
            counter.classList.remove('hidden');
            counter.textContent = `(${remaining})`;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateEstimatedShipDate();
    initCharacterCounter();
});