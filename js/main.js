'use strict';
const $form = document.querySelector('.landing-form');
const $formElement = $form.elements;
const $landingPage = document.querySelector('div[data-view="landing-page"]');
const $formPage = document.querySelector('div[data-view="form-page"]');
const $entriesPage = document.querySelector('div[data-view="entries-page"]');
const $loadingPage = document.querySelector('div[data-view="loading-page"]');
const $formHook = document.querySelector('.form-page');
if (!$form) throw new Error('$form query failed.');
if (!$landingPage) throw new Error('$landingPage query failed.');
if (!$formPage) throw new Error('$formPage query failed.');
if (!$entriesPage) throw new Error('$entriesPage query failed.');
if (!$loadingPage) throw new Error('$loadingPage query failed.');
if (!$formHook) throw new Error('$formHook query failed.');
$form.addEventListener('submit', async (event) => {
  event.preventDefault();
  viewSwap('loading-page');
  const getRequestArr = await getRequest($formElement.city.value);
  const entriesObject = {
    title: $formElement.city.value,
    resultDescription: getRequestArr[0],
    imageLink: getRequestArr[1],
    entryId: data.nextEntryId,
  };
  data.nextEntryId++;
  data.entries.unshift(entriesObject);
  const $newLiTree = render(entriesObject);
  $formHook.prepend($newLiTree);
  $form.reset();
  const listOfEntries = document.querySelectorAll('[data-entry-id]');
  console.log(listOfEntries);
  for (let i = 0; i < listOfEntries.length; i++) {
    const $hidePriorEntries = document.querySelector(
      `div[data-entry-id="${i}"]`,
    );
    $hidePriorEntries?.setAttribute('class', 'row hidden');
  }
  viewSwap('form-page');
  $form.reset();
});
function render(entry) {
  const $divRow = document.createElement('div');
  $divRow.setAttribute('class', 'row');
  $divRow.setAttribute('data-entry-id', String(entry.entryId));
  const $divColHalf = document.createElement('div');
  $divColHalf.setAttribute('class', 'column-half');
  const $divImageContainer = document.createElement('div');
  $divImageContainer.setAttribute('class', 'image-container');
  const $image = document.createElement('img');
  $image.setAttribute('class', 'image');
  $image.setAttribute('src', entry.imageLink);
  $image.setAttribute('alt', entry.title);
  const $divColHalf2 = document.createElement('div');
  $divColHalf2.setAttribute('class', 'column-half');
  const $divTextual = document.createElement('div');
  $divTextual.setAttribute('class', 'textual');
  const $cityHeading = document.createElement('h1');
  $cityHeading.textContent = entry.title;
  const $description = document.createElement('p');
  $description.textContent = entry.resultDescription;
  $divTextual.appendChild($cityHeading);
  $divTextual.appendChild($description);
  $divColHalf2.appendChild($divTextual);
  $divImageContainer.appendChild($image);
  $divColHalf.appendChild($divImageContainer);
  $divRow.appendChild($divColHalf);
  $divRow.appendChild($divColHalf2);
  return $divRow;
}
document.addEventListener('DOMContentLoaded', () => {
  for (const entry of data.entries) {
    const $newLiRowTree = render(entry);
    $formHook.appendChild($newLiRowTree);
  }
  viewSwap(data.view);
  $form.reset();
});
async function getCoordinates(userEntry) {
  try {
    const locationArr = userEntry.split(' ');
    let location = '';
    for (const word of locationArr) {
      location += word + '%20';
    }
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=24eee991e6a741b48f4dd298bf8f58a4`,
    );
    const result = await response.json();
    if (!response.ok) throw new Error('Yikes Error Code: ' + response.status);
    return result.features[0].geometry.coordinates;
  } catch (error) {
    console.log('Throw getCoordinates() Error', error);
    throw error;
  }
}
async function getClimateDetails(coordinates) {
  try {
    const lat = coordinates[1];
    const long = coordinates[0];
    // Encode the target URL with the appropriate route, parameters, and model
    const targetUrl = encodeURIComponent(
      `http://repicea.dynu.net/biosim/BioSimWeather?lat=${lat}&long=${long}&from=2024&to=2100&model=Climatic_Annual&rcp=8_5&climMod=GCM4&format=json`,
    );
    // Fetch the data 10 times using a CORS proxy to avoid cross-origin issues
    const responses = await Promise.all(
      new Array(11).fill(null).map(async () => {
        return fetch(`https://lfz-cors.herokuapp.com/?url=${targetUrl}`);
      }),
    );
    const results = await Promise.all(
      responses.map(async (response) => {
        if (!response.ok) {
          throw new Error('Yikes Error Code: ' + response.status);
        }
        return response.json();
      }),
    );
    let meanHigh2024 = 0;
    let highest2024 = 0;
    let totalPrcp2024 = 0;
    let meanHigh2100 = 0;
    let highest2100 = 0;
    let totalPrcp2100 = 0;
    for (let i = 0; i < results.length; i++) {
      meanHigh2024 +=
        (Number(results[i].Climatic_Annual[0][0][0].MeanTmax) * 9) / 5 + 32;
      highest2024 +=
        (Number(results[i].Climatic_Annual[0][0][0].HitghestTmax) * 9) / 5 + 32;
      totalPrcp2024 += Number(results[i].Climatic_Annual[0][0][0].TotalPrcp);
      meanHigh2100 +=
        (Number(results[i].Climatic_Annual[0][0][76].MeanTmax) * 9) / 5 + 32;
      highest2100 +=
        (Number(results[i].Climatic_Annual[0][0][76].HitghestTmax) * 9) / 5 +
        32;
      totalPrcp2100 += Number(results[i].Climatic_Annual[0][0][76].TotalPrcp);
    }
    const averagedResultObj = {
      meanHigh2024: String(meanHigh2024 / results.length) + '°F',
      highest2024: String(highest2024 / results.length) + '°F',
      totalPrcp2024: String(totalPrcp2024 / results.length) + 'mm',
      meanHigh2100: String(meanHigh2100 / results.length) + '°F',
      highest2100: String(highest2100 / results.length) + '°F',
      totalPrcp2100: String(totalPrcp2100 / results.length) + 'mm',
    };
    return averagedResultObj;
  } catch (error) {
    console.log('Throw getClimateDetails() Error', error);
    throw error;
  }
}
async function getRequest(userEntry) {
  const coordsArr = await getCoordinates(userEntry);
  const climateDataObj = await getClimateDetails(coordsArr);
  const newStr = `highest 2024:
    ${climateDataObj.highest2024},

     mean high 2024:
     ${climateDataObj.meanHigh2024},

     total precipitation 2024:
     ${climateDataObj.totalPrcp2024},

     highest 2100:
     ${climateDataObj.highest2100},

     mean high 2100:
     ${climateDataObj.meanHigh2100},

     total precipitation 2100:
     ${climateDataObj.totalPrcp2100}`;
  return [
    newStr,
    '/images/DALL·E 2024-03-06 09.38.46 - Capture the essence of Irvine, California, with a focus on its distinctive characteristics. The image should feature the blend of urban and suburban e.webp',
  ];
}
function viewSwap(view) {
  if (view === 'landing-page') {
    $landingPage.setAttribute('class', '');
    $formPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
  } else if (view === 'form-page') {
    $formPage.setAttribute('class', '');
    $landingPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
  } else if (view === 'entries-page') {
    $entriesPage.setAttribute('class', '');
    $formPage.setAttribute('class', 'hidden');
    $landingPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
  } else if (view === 'loading-page') {
    $loadingPage.setAttribute('class', '');
    $entriesPage.setAttribute('class', 'hidden');
    $formPage.setAttribute('class', 'hidden');
    $landingPage.setAttribute('class', 'hidden');
  }
}
