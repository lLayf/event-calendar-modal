// Sélection des éléments du DOM
const calendarBody = document.getElementById("calendarBody");
const monthYearElement = document.getElementById("monthYear");

// Variables globales pour le calendrier
let currentDate = new Date();

// Affiche les jours du mois dans le calendrier
function displayDays() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let dayCounter = 1;

    for (let row = 0; row < 6; row++) {
        const rowElement = document.createElement("tr");

        for (let col = 0; col < 7; col++) {
            const cell = document.createElement("td");
            const dayNumber = dayCounter - firstDayOfMonth;

            if (dayCounter > firstDayOfMonth && dayCounter <= daysInMonth + firstDayOfMonth) {
                cell.textContent = dayNumber;
                cell.classList.add("calendar__day-cell", "current-month-day");
            } else {
                cell.textContent = dayNumber <= 0 ? new Date(year, month, 0).getDate() + dayNumber : dayNumber - daysInMonth;
                cell.classList.add("calendar__day-cell", "disabled");
            }

            rowElement.appendChild(cell);
            dayCounter++;
        }

        calendarBody.appendChild(rowElement);
    }
}

// Génère le calendrier pour le mois et l'année actuels
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Nom du mois et année pour l'en-tête
    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    monthYearElement.textContent = `${monthNames[month]} ${year}`;

    // Réinitialiser le contenu du calendrier
    calendarBody.innerHTML = "";

    displayDays();
}

// Génère le calendrier initial
generateCalendar();