"use strict";

import { bierData } from "./bier-data.js";

document.addEventListener("DOMContentLoaded", () => {

  let selectedStijl = ""; // Variabele om de geselecteerde stijl bij te houden, initieel leeg

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
    selectElementById("bier-feit").textContent = `Leuk weetje: ${feit}`;
    selectElementById("bier-afbeelding").src = afbeelding;
    selectElementById("bier-afbeelding").alt = naam;
  }

  function getRandomBier() {
    let filteredBier;
    if (selectedStijl === "") {
      filteredBier = bierData; // Geen stijl geselecteerd, toon alle bieren
    } else {
      filteredBier = bierData.filter((bier) => bier.stijl === selectedStijl);
    }
    const randomIndex = Math.floor(Math.random() * filteredBier.length);
    return filteredBier[randomIndex];
  }

  function filterBierByStijl(bierStijl) {
    selectedStijl = bierStijl; // Bijhouden van de geselecteerde stijl
    if (bierStijl === "Alle") {
      return bierData;
    } else {
      return bierData.filter((bier) => bier.stijl === bierStijl);
    }
  }



  const popup = document.querySelector(".popup");
  const popupError = document.querySelector(".popup-error");
  const popupBierStijlSelect = selectElementById("popup-bierstijl-select");
  const popupToonBierKnop = selectElementById("popup-toon-bier-knop");

  // Popup initieel weergeven
  popup.classList.add("show");

  popupToonBierKnop.addEventListener("click", () => {
    const selectedStijl = popupBierStijlSelect.value;
    if (selectedStijl === "") {
      popupError.textContent = "Selecteer eerst een bierstijl.";
      popupError.style.display = "block";
    } else {
      popupError.style.display = "none";
      popup.classList.remove("show");
      filterBierByStijl(selectedStijl);
      const newBier = getRandomBier();
      updateBierInfo(newBier);
      selectElementById("geselecteerde-stijl").textContent = `Geselecteerde stijl: ${selectedStijl}`;
    }
  });

  const initialBier = getRandomBier();
  updateBierInfo(initialBier);

  selectElementById('nieuw-bier-knop').addEventListener('click', () => {
    const newBier = getRandomBier();
    updateBierInfo(newBier);
  });
});
