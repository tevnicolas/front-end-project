'use strict';
const $form = document.querySelector('.landing-form');
const $formElement = $form.elements;
const $landingPage = document.querySelector('div[data-view="landing-page"]');
const $formPage = document.querySelector('div[data-view="form-page"]');
const $entriesPage = document.querySelector('div[data-view="entries-page"]');
if (!$form) throw new Error('$form query failed.');
if (!$landingPage) throw new Error('$landingPage query failed.');
if (!$formPage) throw new Error('$formPage query failed.');
if (!$entriesPage) throw new Error('$entriesPage query failed.');
$form.addEventListener('submit', async (event) => {
  event.preventDefault();
  $landingPage.setAttribute('class', 'hidden');
  const entriesObject = {
    title: $formElement.city.value,
    resultDescription: await getRequest($formElement.city.value),
    entryId: data.nextEntryId,
  };
  viewSwap('form-page');
  console.log(entriesObject);
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
  console.log(coordsArr);
  const climateDataObj = await getClimateDetails(coordsArr);
  return JSON.stringify(climateDataObj);
}
function viewSwap(view) {
  if (view === 'landing-page') {
    $landingPage.setAttribute('class', '');
    $formPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
  } else if (view === 'form-page') {
    $formPage.setAttribute('class', '');
    $landingPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
  } else if (view === 'entries-page') {
    $entriesPage.setAttribute('class', '');
    $formPage.setAttribute('class', 'hidden');
    $landingPage.setAttribute('class', 'hidden');
  }
}
