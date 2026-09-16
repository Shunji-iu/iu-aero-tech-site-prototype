// 活動予定表
const scheduleList = document.getElementById("schedule-list");

if (scheduleList) {
    fetch("schedule-data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(function (item) {
                scheduleList.innerHTML += `
                    <div class="schedule-item">
                        <div class="schedule-date">
                            <span>${item.year}</span>
                            ${item.date}
                        </div>
                        <div class="schedule-content">
                            <span class="schedule-category">${item.category}</span>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            <p class="schedule-place">📍 ${item.place}</p>
                        </div>
                    </div>
                `;
            });
        });
}
