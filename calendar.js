// Sélection des éléments du DOM
const calendarBody = document.getElementById("calendarBody");
const monthYearElement = document.getElementById("monthYear");
const prevBtn = document.querySelector(".calendar__nav-button--prev");
const nextBtn = document.querySelector(".calendar__nav-button--next");
const prevYearBtn = document.querySelector(".year-change__button--prev");
const nextYearBtn = document.querySelector(".year-change__button--next");
const openModalBtn = document.getElementById("openModalBtn");
const eventDateInput = document.getElementById("eventDate");
const eventNameInput = document.getElementById("eventName");
const addEventBtn = document.getElementById("addEventBtn");
const eventModal = document.getElementById("eventModal");
const closeModalBtn = document.querySelector(".modal__close");
const eventsContainer = document.getElementById("eventsContainer");

// Variables globales pour le calendrier
let currentDate = new Date();
let selectedDate = null;
let events = {};

// ==================
// Système Pub/Sub
// ==================
const pubSub = {
    events: {},

    subscribe: function(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },

    publish: function(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    }
};

// Pour ajouter du code supplémentaire qui devrait être exécuté
// chaque fois qu'un événement est ajouté.
pubSub.subscribe('eventAdded', function(eventName) {
    console.log(`Un nouvel événement "${eventName}" a été ajouté !`);
});

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
            const dayNumber = dayCounter - firstDayOfMonth + 1;

            if (dayNumber > 0 && dayNumber <= daysInMonth) {
                cell.textContent = dayNumber;
                cell.classList.add("calendar__day-cell", "current-month-day");

                // Compteur pour afficher le nombre d'événements pour cette date
                const eventCounter = document.createElement("div");
                eventCounter.classList.add("event-counter");

                const dateValue = new Date(year, month, dayNumber).toISOString().split("T")[0];
                const eventCount = events[dateValue]?.length || 0;
                eventCounter.textContent = eventCount > 0 ? `(${eventCount})` : "";

                cell.appendChild(eventCounter);

                // Mettre en évidence le jour actuel
                if (year === new Date().getFullYear() && month === new Date().getMonth() && dayNumber === new Date().getDate()) {
                    cell.classList.add("current-day");
                }

                // Mettre en évidence le jour sélectionné
                if (selectedDate && selectedDate.getDate() === dayNumber && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
                    cell.classList.add("selected-day");
                }

                // Ajouter le gestionnaire d'événement pour la date
                cell.addEventListener("click", handleDateClick);
            } else {
                cell.textContent = dayNumber <= 0 ? new Date(year, month, 0).getDate() + dayNumber + 1 : dayNumber - daysInMonth;
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

// Ajoute un événement à la liste des événements
function addEvent() {
    const selectedDateValue = eventDateInput.value;
    const eventName = eventNameInput.value;

    if (!selectedDateValue || !eventName) {
        alert("Veuillez remplir tous les champs pour ajouter un événement.");
        return;
    }

    // Séparer l'année, le mois et le jour à partir de la valeur de l'input
    const [year, month, day] = selectedDateValue.split("-");
    // Créer une date avec l'heure à minuit (00:00:00) pour le jour sélectionné
    const selectedDate = new Date(year, month - 1, day);

    // Vérifier si la date existe déjà dans la liste des événements
    if (!events[selectedDate.toISOString().split("T")[0]]) {
        events[selectedDate.toISOString().split("T")[0]] = [];
    }

    // Ajouter l'événement à la liste des événements pour cette date
    events[selectedDate.toISOString().split("T")[0]].push(eventName);

    // Notifier les abonnés de l'ajout d'un nouvel événement
    pubSub.publish('eventAdded', eventName);

    displayEventsForSelectedDate();

    // Réinitialiser les champs du formulaire
    eventDateInput.value = "";
    eventNameInput.value = "";

    // Fermer la modal après avoir ajouté l'événement
    eventModal.style.display = "none";

    // Mettre à jour les compteurs d'événements dans le calendrier
    updateEventCounters();
}

// Ouvre la modal pour ajouter un événement
function openEventModal() {
    eventModal.style.display = "block";

    // Mettre la date présélectionnée dans l'input, ou utiliser la date actuelle par défaut
    if (selectedDate) {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        eventDateInput.value = `${year}-${month}-${day}`;
    } else {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        eventDateInput.value = `${year}-${month}-${day}`;
    }
}

// Ferme la modal
function closeModal() {
    eventModal.style.display = "none";
}

// Affiche les événements pour la date sélectionnée
function displayEventsForSelectedDate() {
    eventsContainer.innerHTML = "";

    const selectedDateValue = selectedDate?.toISOString().split("T")[0];
    if (events[selectedDateValue] && events[selectedDateValue].length > 0) {
        for (const eventText of events[selectedDateValue]) {
            const eventElement = document.createElement("div");
            eventElement.classList.add("event");
            eventElement.textContent = eventText;
            eventsContainer.appendChild(eventElement);
        }
    }
}

// Gère le clic sur une date du calendrier
function handleDateClick(event) {
    const clickedCell = event.target;
    if (!clickedCell.classList.contains("disabled")) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = parseInt(clickedCell.textContent);
        selectedDate = new Date(year, month, day);

        // Mettre en évidence la date sélectionnée
        const selectedDayCell = document.querySelector(".selected-day");
        if (selectedDayCell) {
            selectedDayCell.classList.remove("selected-day");
        }
        clickedCell.classList.add("selected-day");

        // Afficher les événements existants pour cette date
        displayEventsForSelectedDate();
    }
}

// Met à jour les compteurs d'événements dans le calendrier
function updateEventCounters() {
    const allCells = document.querySelectorAll(".current-month-day");
    allCells.forEach((cell) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = parseInt(cell.textContent);
        const dateValue = new Date(year, month, day).toISOString().split("T")[0];
        const eventCount = events[dateValue]?.length || 0;
        const eventCounter = cell.querySelector(".event-counter");
        eventCounter.textContent = eventCount > 0 ? `(${eventCount})` : "";
    });
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
openModalBtn.addEventListener("click", openEventModal);
addEventBtn.addEventListener("click", addEvent);
closeModalBtn.addEventListener("click", closeModal);

// Ferme la modal si l'utilisateur clique en dehors de la modal
window.addEventListener("click", function(event) {
    if (event.target === eventModal) {
        closeModal();
    }
});

// Génère le calendrier initial
generateCalendar();