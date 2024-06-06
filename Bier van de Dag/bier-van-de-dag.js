"use strict";

import { bierData } from "./bier-data.js";

document.addEventListener("DOMContentLoaded", () => {

  let selectedStijl = ""; // Variabele om de geselecteerde stijl bij te houden, initieel leeg
  let currentBier = "";

  function selectElementById(id) {
    return document.getElementById(id);
  }

  function updateBierInfo(bier) {
    console.log("updateBierInfo wordt aangeroepen...");
    console.log("Ontvangen bier object:", bier);
    // Destructuring
    const {
      naam,
      alcohol,
      brouwerij,
      stijl,
      beschrijving,
      feit,
      afbeelding
    } = bier;

    selectElementById("bier-naam").innerHTML = `<strong>${naam}</strong>`;
    selectElementById("bier-alcohol").innerHTML = `<strong>Alcoholpercentage:</strong> ${alcohol}`;
    selectElementById("bier-brouwerij").innerHTML = `<strong>Brouwerij:</strong> ${brouwerij}`;
    selectElementById("bier-stijl").innerHTML = `<strong>Stijl:</strong> ${stijl}`;
    selectElementById("bier-beschrijving").textContent = beschrijving;
    selectElementById("bier-afbeelding").src = afbeelding;
    selectElementById("bier-afbeelding").alt = naam;

    currentBier = bier;
  }

  function getRandomBier(...args) {
    let filteredBier;
    if (selectedStijl === "") {
      filteredBier = [...bierData]; // Geen stijl geselecteerd, toon alle bieren
    } else {
      filteredBier = [...bierData.filter((bier) => bier.stijl === selectedStijl)];
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

  function displayBierWeetje(bier) {
    fetchBierWeetje(bier)
      .then((weetje) => {
        const weetjeElement = selectElementById("bier-weetje");
        const weetjeKnop = selectElementById("toon-weetje-knop");

        weetjeElement.innerHTML = `<strong>Leuk weetje:</strong><br> ${weetje}`;
        weetjeKnop.style.display = "none";
      })
      .catch((error) => {
        console.error(error);
        const weetjeElement = selectElementById("bier-weetje");
        weetjeElement.textContent = "Er is een fout opgetreden bij het ophalen van het weetje.";
      });
  }

  selectElementById("toon-weetje-knop").addEventListener("click", () => {
    if (currentBier) {
      displayBierWeetje(currentBier);
    }
  });

  const popup = document.querySelector(".popup");
  const popupError = document.querySelector(".popup-error");
  const popupBierStijlSelect = selectElementById("popup-bierstijl-select");
  const popupToonBierKnop = selectElementById("popup-toon-bier-knop");

  // Popup initieel weergeven
  popup.classList.add("show");

  popupToonBierKnop.addEventListener("click", () => {
    const selectedStijlValue = popupBierStijlSelect.value;
    if (selectedStijlValue === "") {
      popupError.textContent = "Selecteer eerst een bierstijl.";
      popupError.style.display = "block";
    } else {
      popupError.style.display = "none";
      popup.classList.remove("show");
      selectedStijl = selectedStijlValue;
      const newBier = getRandomBier(selectedStijl);
      updateBierInfo(newBier);
      selectElementById("geselecteerde-stijl").textContent = `Geselecteerde stijl: ${selectedStijl}`;
    }
  });

  const initialBier = getRandomBier();
  updateBierInfo(initialBier);

  selectElementById('nieuw-bier-knop').addEventListener('click', () => {
    let newBier = getRandomBier();
    while (newBier === currentBier) {
      newBier = getRandomBier();
    }
    updateBierInfo(newBier);

    const weetjeElement = selectElementById("bier-weetje");
    weetjeElement.textContent = ""; //Maak de inhoud van het weetje leeg

    const weetjeKnop = selectElementById("toon-weetje-knop");
    weetjeKnop.style.display = "block"; // Maak de knop weer zichtbaar
    weetjeKnop.style.margin = "auto"
  });
});
