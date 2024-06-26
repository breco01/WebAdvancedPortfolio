"use strict";

import { bierData } from "./bier-data.js";

(function() {console.log("Dit is een self executing function");})

document.addEventListener("DOMContentLoaded", () => {
  let selectedStijl = "";
  let currentBier = "";

  function initializeMap(latitude, longitude) {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYnJlbnRjb3JuZXQiLCJhIjoiY2x4M2V4bTRwMDA5NjJrc2I0OWlzczh5aSJ9.WRIVm2FPJm5Sb4ovgDUxbg";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 12,
    });

    new mapboxgl.Marker({ color: "#b8860b" })
      .setLngLat([longitude, latitude])
      .addTo(map);
  }

  function selectElementById(id) {
    return document.getElementById(id);
  }

  async function fetchWeather(latitude, longitude) {
    const apiKey = "af72c10bef76426ea42113750240706";
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`);
    const weatherData = await response.json();
    return weatherData;
  }

  async function updateBierInfo(bier) {
    console.log("updateBierInfo wordt aangeroepen...");
    console.log("Ontvangen bier object:", bier);
    // Destructuring
    const { naam, alcohol, brouwerij, stijl, beschrijving, feit, afbeelding, locatie } = bier;

    selectElementById("bier-naam").innerHTML = `<strong>${naam}</strong>`;
    selectElementById("bier-alcohol").innerHTML = `<strong>Alcoholpercentage:</strong> ${alcohol}`;
    selectElementById("bier-brouwerij").innerHTML = `<strong>Brouwerij:</strong> ${brouwerij}`;
    selectElementById("bier-stijl").innerHTML = `<strong>Stijl:</strong> ${stijl}`;
    selectElementById("bier-beschrijving").textContent = beschrijving;
    selectElementById("bier-afbeelding").src = afbeelding;
    selectElementById("bier-afbeelding").alt = naam;

    initializeMap(locatie.latitude, locatie.longitude);

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
      }, 200);
    })
    .then((weetje) => {
      console.log("Weetje opgelost:", weetje);
      return weetje;
    })
    .catch((error) => {
      console.error("Fout bij het ophalen van het weetje:", error);
      throw error;
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
      weetjeElement.textContent = "Er is een fout opgetreden bij het ophalen van het weetje.";
    }
  }

  function saveToFavorites(bier) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const isDuplicate = favorites.some((favorite) => favorite.naam === bier.naam);

    if (!isDuplicate) {
      favorites.push(bier);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert(`${bier.naam} is toegevoegd aan je favorieten!`);
      displayFavorites();
    } else {
      alert(`${bier.naam} is al toegevoegd aan je favorieten!`);
    }
  }

  function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log("Favoriete bieren:", favorites);
    return favorites;
  }

  function displayFavorites() {
    const favorites = loadFavorites();
    const favorietenLijst = selectElementById("favorieten-lijst");
    favorietenLijst.innerHTML = "";

    if (favorites.length === 0) {
      favorietenLijst.innerHTML = "<p>Je hebt nog geen favoriete bieren.</p>";
      return;
    }

    favorites.forEach((bier) => {
      const bierElement = document.createElement("div");
      bierElement.classList.add("favoriet-item");

      bierElement.innerHTML = `
        <h3>${bier.naam}</h3>
        <p><strong>Alcoholpercentage:</strong> ${bier.alcohol}</p>
        <p><strong>Brouwerij:</strong> ${bier.brouwerij}</p>
        <p><strong>Stijl:</strong> ${bier.stijl}</p>
        <p>${bier.beschrijving}</p>
        <img src="${bier.afbeelding}" alt="${bier.naam}" class="favoriet-afbeelding" />
      `;

      favorietenLijst.appendChild(bierElement);
    });
  }

  selectElementById("toon-weetje-knop").addEventListener("click", () => {
    if (currentBier) {
      displayBierWeetje(currentBier);
    }
  });

  const zieMijnFavorietenKnop = selectElementById("zie-mijn-favorieten");
  zieMijnFavorietenKnop.addEventListener("click", () => {
    const favorietenContainer = document.querySelector(".favorieten-container");
    favorietenContainer.classList.toggle("show");
    displayFavorites();
  });

  const sluitFavorietenKnop = document.querySelector(".favorieten-container .sluit-knop");
  sluitFavorietenKnop.addEventListener("click", () => {
    const favorietenContainer = document.querySelector(".favorieten-container");
    favorietenContainer.classList.remove("show");
  });

  const toonWeerKnop = selectElementById("toon-weer-knop");
  const sluitWeerKnop = document.querySelector(".weer-container .sluit-weer-knop");
  const weerContainer = document.querySelector(".weer-container");

  toonWeerKnop.addEventListener("click", async () => {
    if (currentBier) {
      try {
        const weerInfo = selectElementById("weer-info");
        const weather = await fetchWeather(currentBier.locatie.latitude, currentBier.locatie.longitude);
        const weatherIcon = weather.current.condition.icon;

        weerInfo.innerHTML = `
                <p>${weather.current.condition.text}, ${weather.current.temp_c}°C<img src="${weatherIcon}" alt="Weer icoon"></p>
        `;
        weerContainer.classList.add("show");
      } catch (error) {
        console.error("Fout bij het ophalen van het weer:", error);
      }
    }
  });

  sluitWeerKnop.addEventListener("click", () => {
    weerContainer.classList.remove("show");
  });

  const popup = document.querySelector(".popup");
  const popupError = document.querySelector(".popup-error");
  const popupBierStijlSelect = selectElementById("popup-bierstijl-select");
  const popupBevestigKnop = selectElementById("bevestig-knop");
  const container = document.querySelector(".container");

  function deleteWeetjeContent() {
    const weetjeElement = selectElementById("bier-weetje");
    weetjeElement.textContent = ""; // Maak de inhoud van het weetje leeg

    const weetjeKnop = selectElementById("toon-weetje-knop");
    weetjeKnop.style.display = "block"; // Maak de knop weer zichtbaar
    weetjeKnop.style.margin = "auto";
  } 

  popupBevestigKnop.addEventListener("click", () => {
    const geboortedatumInput = document.getElementById("geboortedatum-input").value;
    const geboortedatum = new Date(geboortedatumInput);
    const huidigeDatum = new Date();
    const verschilInJaren = huidigeDatum.getFullYear() - geboortedatum.getFullYear();

    if (verschilInJaren < 16) {
      popupError.textContent = "Je moet minimaal 16 jaar zijn om deze website te bezoeken.";
      popupError.style.display = "block";
    } else {
      popupError.style.display = "none";
      popup.classList.remove("show");

      popupBierStijlSelect.addEventListener("change", () => {
        const selectedStijlValue = popupBierStijlSelect.value;
        selectedStijl = selectedStijlValue;
        const newBier = getRandomBier(selectedStijl);
        updateBierInfo(newBier);
        selectElementById("geselecteerde-stijl").textContent = `Geselecteerde stijl: ${selectedStijl}`;
        deleteWeetjeContent();
      });

      container.classList.add("show");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });

  selectElementById("favoriet-knop").addEventListener("click", () => {
    if (currentBier) {
      saveToFavorites(currentBier);
    }
  });

  const initialBier = getRandomBier();
  updateBierInfo(initialBier);

  selectElementById("nieuw-bier-knop").addEventListener("click", () => {
    let newBier = getRandomBier(selectedStijl);
    while (newBier === currentBier) {
      newBier = getRandomBier(selectedStijl);
    }
    updateBierInfo(newBier);
    deleteWeetjeContent();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  loadFavorites();
});
