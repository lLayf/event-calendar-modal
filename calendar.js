// Sélection des éléments du DOM
const calendarBody = document.getElementById("calendarBody");
const monthYearElement = document.getElementById("monthYear");
const prevBtn = document.querySelector(".calendar__nav-button--prev");
const nextBtn = document.querySelector(".calendar__nav-button--next");
const prevYearBtn = document.querySelector(".year-change__button--prev");
const nextYearBtn = document.querySelector(".year-change__button--next");

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

// Passe au mois précédent
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    selectedDate = null;
    generateCalendar();
}

// Passe au mois suivant
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    selectedDate = null;
    generateCalendar();
}

// Passe à l'année précédente
function prevYear() {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    selectedDate = null;
    generateCalendar();
}

// Passe à l'année suivante
function nextYear() {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    selectedDate = null;
    generateCalendar();
}

// Ajoute les gestionnaires d'événements aux boutons et éléments interactifs
prevBtn.addEventListener("click", previousMonth);
nextBtn.addEventListener("click", nextMonth);
prevYearBtn.addEventListener("click", prevYear);
nextYearBtn.addEventListener("click", nextYear);

// Génère le calendrier initial
generateCalendar();