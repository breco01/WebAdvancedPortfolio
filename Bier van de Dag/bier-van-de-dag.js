"use strict";

import { bierData } from "./bier-data.js";

document.addEventListener("DOMContentLoaded", () => {
  let selectedStijl = ""; // Variabele om de geselecteerde stijl bij te houden, initieel leeg
  let currentBier = "";

  function initializeMap(latitude, longitude) {
    mapboxgl.accessToken = "pk.eyJ1IjoiYnJlbnRjb3JuZXQiLCJhIjoiY2x4M2V4bTRwMDA5NjJrc2I0OWlzczh5aSJ9.WRIVm2FPJm5Sb4ovgDUxbg"
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10",
      center: [longitude, latitude],
      zoom: 12,
    });

    new mapboxgl.Marker({color: '#b8860b'}).setLngLat([longitude, latitude]).addTo(map);
  }

  function selectElementById(id) {
    return document.getElementById(id);
  }

  function updateBierInfo(bier) {
    console.log("updateBierInfo wordt aangeroepen...");
    console.log("Ontvangen bier object:", bier);
    // Destructuring
    const { naam, alcohol, brouwerij, stijl, beschrijving, feit, afbeelding } =
      bier;

    selectElementById("bier-naam").innerHTML = `<strong>${naam}</strong>`;
    selectElementById(
      "bier-alcohol"
    ).innerHTML = `<strong>Alcoholpercentage:</strong> ${alcohol}`;
    selectElementById(
      "bier-brouwerij"
    ).innerHTML = `<strong>Brouwerij:</strong> ${brouwerij}`;
    selectElementById(
      "bier-stijl"
    ).innerHTML = `<strong>Stijl:</strong> ${stijl}`;
    selectElementById("bier-beschrijving").textContent = beschrijving;
    selectElementById("bier-afbeelding").src = afbeelding;
    selectElementById("bier-afbeelding").alt = naam;

    initializeMap(bier.locatie.latitude, bier.locatie.longitude);

    currentBier = bier;
  }

  function getRandomBier(...args) {
    let filteredBier;
    if (selectedStijl === "") {
      filteredBier = [...bierData]; // Geen stijl geselecteerd, toon alle bieren
    } else {
      filteredBier = [
        ...bierData.filter((bier) => bier.stijl === selectedStijl),
      ];
    }
    const randomIndex = Math.floor(Math.random() * filteredBier.length);
    return filteredBier[randomIndex];
  }

  function fetchBierWeetje(bier) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (bier && bier.feit) {
          resolve(bier.feit);
        } else {
          reject("Geen weetje gevonden voor het geselecteerde bier.");
        }
      });
    });
  }

  async function displayBierWeetje(bier) {
    try {
      const weetje = await fetchBierWeetje(bier);
      const weetjeElement = selectElementById("bier-weetje");
      const weetjeKnop = selectElementById("toon-weetje-knop");

      weetjeElement.innerHTML = `<strong>Leuk weetje:</strong><br> ${weetje}`;
      weetjeKnop.style.display = "none";
    } catch (error) {
      console.error(error);
      const weetjeElement = selectElementById("bier-weetje");
      weetjeElement.textContent =
        "Er is een fout opgetreden bij het ophalen van het weetje.";
    }
  }

  selectElementById("toon-weetje-knop").addEventListener("click", () => {
    if (currentBier) {
      displayBierWeetje(currentBier);
    }
  });

  const overlay = document.querySelector(".overlay");
  const popup = document.querySelector(".popup");
  const popupError = document.querySelector(".popup-error");
  const popupBierStijlSelect = selectElementById("popup-bierstijl-select");
  const popupToonBierKnop = selectElementById("popup-toon-bier-knop");
  const container = document.querySelector(".container");

  function showOverlay() {
    overlay.style.display = "block";
  }

  function hideOverlay() {
    overlay.style.display = "none";
  }

  function hidePopup() {
    popup.classList.remove("show");
    hideOverlay();
  }

  function showContainer() {
    container.classList.add("show");
  }

  // Popup initieel weergeven
  popup.classList.add("show");
  showOverlay();

  popupToonBierKnop.addEventListener("click", () => {
    const selectedStijlValue = popupBierStijlSelect.value;
    if (selectedStijlValue === "") {
      popupError.textContent = "Selecteer eerst een bierstijl.";
      popupError.style.display = "block";
    } else {
      popupError.style.display = "none";
      hidePopup();
      selectedStijl = selectedStijlValue;
      const newBier = getRandomBier(selectedStijl);
      updateBierInfo(newBier);
      selectElementById(
        "geselecteerde-stijl"
      ).textContent = `Geselecteerde stijl: ${selectedStijl}`;
      showContainer();
    }
  });

  const initialBier = getRandomBier();
  updateBierInfo(initialBier);

  selectElementById("nieuw-bier-knop").addEventListener("click", () => {
    let newBier = getRandomBier();
    while (newBier === currentBier) {
      newBier = getRandomBier();
    }
    updateBierInfo(newBier);

    const weetjeElement = selectElementById("bier-weetje");
    weetjeElement.textContent = ""; //Maak de inhoud van het weetje leeg

    const weetjeKnop = selectElementById("toon-weetje-knop");
    weetjeKnop.style.display = "block"; // Maak de knop weer zichtbaar
    weetjeKnop.style.margin = "auto";
  });
});
