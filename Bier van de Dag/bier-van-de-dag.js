"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const bierData = [
    {
      naam: "Cornet Oaked",
      alcohol: "8,5%",
      brouwerij: "Brouwerij De Hoorn",
      stijl: "Belgian Strong Golden Ale",
      beschrijving:
        "Cornet Oaked is een Belgisch blond bier van hoge gisting. Het heeft een stevig alcoholpercentage en een complex smaakprofiel met fruitige tonen, kruidige aroma's en een subtiele zoetheid van mout. Wat het onderscheidt, is zijn rijping op eikenhouten vaten, wat een extra laag van complexiteit en een lichte houtsmaak toevoegt aan het bier.",
      feit: "Oorspronkelijk werd Cornet Oaked voor de eerste keer gebrouwen in de 17de eeuw door verre familie van mij.",
      afbeelding: "Afbeeldingen/Cornet.png",
    },

    {
      naam: "Oude Geuze Cuvée Armand & Gaston",
      alcohol: "5,5%",
      brouwerij: "3 Fonteinen",
      stijl: "Lambic - Gueuze",
      beschrijving:
        "3 Fonteinen Oude Geuze Cuvee Armand & Gaston is een Belgische geuze van wereldklasse, vernoemd naar Armand Debelder en zijn zoon Gaston. Het bier wordt traditioneel geproduceerd door het blenden van verschillende leeftijden lambiek en hergist op fles. Het resultaat is een complexe en evenwichtige smaak met tonen van citrus en groene appel, dankzij wilde gisten. Cuvee Armand & Gaston wordt beschouwd als een hoogtepunt van vakmanschap binnen de wereld van geuzebieren.",
      feit: "Dit bier is vernoemd naar Armand Debelder, de meesterbrouwer van 3 Fonteinen, en zijn zoon Gaston, die de toekomst van de brouwerij vertegenwoordigt.",
      afbeelding: "Afbeeldingen/3Fonteinen.png",
    },

    {
      naam: "Hefe Weisse Naturtrüb",
      alcohol: "5,4%",
      brouwerij: "Brasserie de la Mule",
      stijl: "Hefeweizen",
      beschrijving:
        "Hefe Weisse Naturtrüb is een Duits tarwebier dat bekend staat om zijn troebelheid, verfrissende smaak en fruitige aroma's. Het wordt traditioneel gebrouwen met een aanzienlijk percentage tarwemout, wat het zijn kenmerkende volle body en romige textuur geeft. Dit bier heeft vaak tonen van banaan, kruidnagel en soms zelfs een vleugje vanille, allemaal afkomstig van de karakteristieke gist die wordt gebruikt tijdens de fermentatie. Hefe Weisse Naturtrüb is geliefd bij bierliefhebbers vanwege zijn levendige en sprankelende karakter, perfect voor het verfrissen op een zomerse dag.",
      feit: "Dit bier wordt traditioneel geserveerd met een schijfje citroen om de fruitige aroma's te accentueren en het bier verfrissender te maken.",
      afbeelding: "Afbeeldingen/HefeWeisse.png",
    },

    {
      naam: "Hands of Desire - Mezcal Barrel Aged Imperial Sour",
      alcohol: "7%",
      brouwerij: "Brasserie Surréaliste",
      stijl: "Sour",
      beschrijving:
        "Hands of Desire - Mezcal Barrel Aged Imperial Sour is een krachtige en complexe bierervaring. Dit bier, geïnspireerd op een traditionele Mexicaanse drank, wordt gebrouwen met een scala aan exotische ingrediënten en vervolgens gerijpt in mezcalvaten. Het resultaat is een explosie van smaak, met tonen van tropisch fruit, houtachtige rokerigheid en een pittige zuurgraad. Dit bier is een avontuur voor de smaakpapillen, perfect voor degenen die op zoek zijn naar iets unieks en gedurfd in hun bierervaring.",
      feit: "Dit bier wordt gerijpt op mezcalvaten, wat een extra dimensie van complexiteit en smaak toevoegt aan het bier, waardoor het een unieke en onvergetelijke ervaring wordt.",
      afbeelding: "Afbeeldingen/HandsOfDesire.png",
    },

    {
      naam: "A Plein Verre",
      alcohol: "5,5%",
      brouwerij: "DOK Brewing Company",
      stijl: "Sour IPA",
      beschrijving:
        "Uit de Gentse wateren ontspringt vandaag een biertje met Brusselse nasmaak. BierKultuur stelt trots haar smaakmakend kindje voor. Onze zure, hoppige bébé. Onze à plein verre. Student, liefhebber of eender wie: tiens ton verre et le bonheur en main!",
      feit: "Tijdens mijn voorzittersjaar bij de studentenvereniging BierKultuur heb ik persoonlijk dit bier gebrouwen in samenwerking met DOK Brewing Company in Gent.",
      afbeelding: "Afbeeldingen/APleinVerre.png",
    },
  ];

  let selectedStijl = ""; // Variabele om de geselecteerde stijl bij te houden

  function selectElementById(id) {
    return document.getElementById(id);
  }

  function updateBierInfo(bier) {
    selectElementById("bier-naam").innerHTML = `<strong>${bier.naam}</strong>`;
    selectElementById("bier-alcohol").innerHTML = `<strong>Alcoholpercentage:</strong> ${bier.alcohol}`;
    selectElementById("bier-brouwerij").innerHTML = `<strong>Brouwerij:</strong> ${bier.brouwerij}`;
    selectElementById("bier-stijl").innerHTML = `<strong>Stijl:</strong> ${bier.stijl}`;
    selectElementById("bier-beschrijving").textContent = bier.beschrijving;
    selectElementById("bier-feit").textContent = `Leuk weetje: ${bier.feit}`;
    selectElementById("bier-afbeelding").src = bier.afbeelding;
    selectElementById("bier-afbeelding").alt = bier.naam;
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

  // Display the popup initially
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