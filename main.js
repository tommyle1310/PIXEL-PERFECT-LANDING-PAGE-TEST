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

document.addEventListener('DOMContentLoaded', updateEstimatedShipDate);