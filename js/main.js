'use strict';
const currentDate = new Date().getFullYear();
const $landingForm = document.querySelector('.landing-form');
const $landingFormElements = $landingForm.elements;
const $landingPage = document.querySelector('div[data-view="landing-page"]');
const $formPage = document.querySelector('div[data-view="form-page"]');
const $entriesPage = document.querySelector('div[data-view="entries-page"]');
const $loadingPage = document.querySelector('div[data-view="loading-page"]');
const $editPage = document.querySelector('div[data-view="edit-page"]');
const $formHook = document.querySelector('.form-page');
const $entriesHook = document.querySelector('.entries-page');
const $header = document.querySelector('#header');
const $headerText = document.querySelector('#header-text');
const $entriesText = document.querySelector('#entries-text');
const $newEntryButtonFormPage = document.querySelector(
  '.form-page .buttonpos1',
);
const $editButtonFormPage = document.querySelector('.form-page .buttonpos2');
const $newEntryButtonEntriesPage = document.querySelector(
  '.entries-page .buttonpos1',
);
const $noEntries = document.querySelector('.no-entries');
const $yearSelect = document.querySelector('#year-select');
if (!$landingForm) throw new Error('$form query failed.');
if (!$landingPage) throw new Error('$landingPage query failed.');
if (!$formPage) throw new Error('$formPage query failed.');
if (!$entriesPage) throw new Error('$entriesPage query failed.');
if (!$loadingPage) throw new Error('$loadingPage query failed.');
if (!$editPage) throw new Error('$editPage query failed.');
if (!$formHook) throw new Error('$formHook query failed.');
if (!$entriesHook) throw new Error('$entriesHook query failed.');
if (!$header) throw new Error('$header query failed.');
if (!$headerText) throw new Error('$headerText query failed.');
if (!$entriesText) throw new Error('$entriesText query failed.');
if (!$newEntryButtonFormPage)
  throw new Error('$newEntryButtonFormPage query failed.');
if (!$newEntryButtonEntriesPage)
  throw new Error('$newEntryButtonEntriesPage query failed.');
if (!$noEntries) throw new Error('$noEntries query failed.');
if (!$yearSelect) throw new Error('$yearSelect query failed.');
$landingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  viewSwap('loading-page');
  const getRequestArr = await getRequest($landingFormElements.city.value);
  const entriesObject = {
    title: getRequestArr[0],
    year: '2100',
    resultDescription: getRequestArr[1],
    imageLink: getRequestArr[2],
    entryId: data.nextEntryId,
  };
  data.nextEntryId++;
  data.entries.unshift(entriesObject);
  const $newRowTreeFormStyle = render(entriesObject, 'long');
  $formHook.prepend($newRowTreeFormStyle);
  const $newRowTreeEntriesStyle = render(entriesObject, 'short');
  $entriesHook.prepend($newRowTreeEntriesStyle);
  hideOtherEntriesExcept('last');
  viewSwap('form-page');
  $landingForm.reset();
});
$header.addEventListener('click', (event) => {
  event.preventDefault();
  const $eventTarget = event.target;
  switch ($eventTarget) {
    case $headerText:
      viewSwap('landing-page');
      break;
    case $entriesText:
      viewSwap('entries-page');
      break;
  }
});
$formHook.addEventListener('click', (event) => {
  event.preventDefault();
  const $eventTarget = event.target;
  switch ($eventTarget) {
    case $newEntryButtonFormPage:
      viewSwap('landing-page');
      break;
    case $editButtonFormPage:
      viewSwap('edit-page');
      break;
  }
});
$entriesHook.addEventListener('click', (event) => {
  event.preventDefault();
  const $eventTarget = event.target;
  const $shortRowTarget = $eventTarget.closest('[data-entry-id]');
  console.log($eventTarget);
  const dataEntryIDTarget = Number(
    $shortRowTarget?.getAttribute('data-entry-id'),
  );
  if ($eventTarget === $newEntryButtonEntriesPage) {
    viewSwap('landing-page');
    console.log('hello');
  } else if ($eventTarget.tagName === 'H1') {
    hideOtherEntriesExcept(dataEntryIDTarget);
    viewSwap('form-page');
  } else if ($eventTarget.tagName === 'I') {
    viewSwap('edit-page');
  }
});
document.addEventListener('DOMContentLoaded', () => {
  for (const entry of data.entries) {
    const $newRowTreeFormStyle = render(entry, 'long');
    const $newRowTreeEntriesStyle = render(entry, 'short');
    $formHook.appendChild($newRowTreeFormStyle);
    $entriesHook.appendChild($newRowTreeEntriesStyle);
  }
  for (let i = 2100; i >= currentDate; i--) {
    const $optionYear = document.createElement('option');
    $optionYear.setAttribute('value', String(i));
    $optionYear.textContent = String(i);
    $yearSelect.appendChild($optionYear);
  }
  toggleNoEntries(); // not sure if I need this here
  viewSwap(data.view); // not certain why this is here yet
  $landingForm.reset(); // also not 100% if this needs to be here
});
function render(entry, option) {
  const rowType = option === 'short' ? 'short-row' : 'row';
  const pType = option === 'short' ? 'short-paragraph' : '';
  const pointer = option === 'short' ? 'pointer' : '';
  const $divRow = document.createElement('div');
  $divRow.setAttribute('class', rowType);
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
  $cityHeading.setAttribute('class', pointer);
  $cityHeading.textContent = entry.title;
  const $description = document.createElement('p');
  $description.setAttribute('class', pType);
  $description.innerHTML = entry.resultDescription;
  const $editIcon = document.createElement('i');
  $editIcon.setAttribute('class', 'fa fa-edit');
  $divTextual.appendChild($cityHeading);
  $divTextual.appendChild($description);
  if (option === 'short') {
    const $iconContainer = document.createElement('div');
    $iconContainer.setAttribute('class', 'edit-icon');
    $iconContainer.appendChild($editIcon);
    $divTextual.appendChild($iconContainer);
  }
  $divColHalf2.appendChild($divTextual);
  $divImageContainer.appendChild($image);
  $divColHalf.appendChild($divImageContainer);
  $divRow.appendChild($divColHalf);
  $divRow.appendChild($divColHalf2);
  return $divRow;
}
function hideOtherEntriesExcept(option) {
  let entryNum = 0;
  const $listOfFormEntries = $formHook.querySelectorAll('[data-entry-id]');
  if (option === 'last') {
    entryNum = $listOfFormEntries.length;
  } else {
    entryNum = option;
  }
  for (let i = 0; i <= $listOfFormEntries.length; i++) {
    const $hideOtherEntries = $formHook.querySelector(
      `div[data-entry-id="${i}"]`,
    );
    if (i !== entryNum) {
      $hideOtherEntries?.setAttribute('class', 'row hidden');
    } else {
      $hideOtherEntries?.setAttribute('class', 'row');
    }
  }
}
function toggleNoEntries() {
  const $listOfEntriesEntries =
    $entriesHook.querySelectorAll('[data-entry-id]');
  if ($listOfEntriesEntries.length === 0) {
    $noEntries.setAttribute('class', 'column-full no-entries');
  } else {
    $noEntries.setAttribute('class', 'column-full no-entries hidden');
  }
}
async function getCoordinatesAndFormatName(locationEntry) {
  try {
    const locationArr = locationEntry.split(' ');
    let location = '';
    for (const word of locationArr) {
      location += word + '%20';
    }
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=` +
        `${location}&apiKey=24eee991e6a741b48f4dd298bf8f58a4`,
    );
    const result = await response.json();
    if (!response.ok) throw new Error('Yikes Error Code: ' + response.status);
    const properLocationName = result.features[0].properties.formatted;
    const coordinatesArr = result.features[0].geometry.coordinates;
    return [...coordinatesArr, properLocationName];
  } catch (error) {
    console.log('Throw getCoordinates() Error', error);
    throw error;
  }
}
async function getClimateDetails(coordsAndProperName, futureYear) {
  try {
    const lat = coordsAndProperName[1];
    const long = coordsAndProperName[0];
    // Encode the target URL with the appropriate route, parameters, and model
    const targetUrl = encodeURIComponent(
      `http://repicea.dynu.net/biosim/BioSimWeather?lat=` +
        `${lat}&long=${long}&from=${currentDate}&to=2100&model=Climatic` +
        `_Annual&rcp=8_5&climMod=GCM4&format=json`,
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
    let meanHighCurr = 0;
    let highestCurr = 0;
    let totalPrcpCurr = 0;
    let meanHighFuture = 0;
    let highestFuture = 0;
    let totalPrcpFuture = 0;
    for (let i = 0; i < results.length; i++) {
      meanHighCurr +=
        (Number(results[i].Climatic_Annual[0][0][0].MeanTmax) * 9) / 5 + 32;
      highestCurr +=
        (Number(results[i].Climatic_Annual[0][0][0].HitghestTmax) * 9) / 5 + 32;
      totalPrcpCurr += Number(results[i].Climatic_Annual[0][0][0].TotalPrcp);
      meanHighFuture +=
        (Number(results[i].Climatic_Annual[0][0][76].MeanTmax) * 9) / 5 + 32;
      highestFuture +=
        (Number(results[i].Climatic_Annual[0][0][76].HitghestTmax) * 9) / 5 +
        32;
      totalPrcpFuture += Number(results[i].Climatic_Annual[0][0][76].TotalPrcp);
    }
    const averagedResultObj = {
      formattedLocationName: coordsAndProperName[2],
      meanOfHighTempsCurrentYear:
        (meanHighCurr / results.length).toFixed() + '°F',
      highestTempOfCurrentYear: (highestCurr / results.length).toFixed() + '°F',
      totalPrecipitationCurrentYear:
        (totalPrcpCurr / results.length).toFixed() + 'mm',
      futureYear,
      meanOfHighTempsFutureYear:
        (meanHighFuture / results.length).toFixed() + '°F',
      highestTempOfFutureYear:
        (highestFuture / results.length).toFixed() + '°F',
      totalPrecipitationFutureYear:
        (totalPrcpFuture / results.length).toFixed() + 'mm',
    };
    return averagedResultObj;
  } catch (error) {
    console.log('Throw getClimateDetails Error', error);
    throw error;
  }
}
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}
async function fetchChartUrl(object) {
  try {
    const chartConfig = {
      type: 'bar',
      data: {
        labels: [currentDate, object.futureYear],
        datasets: [
          {
            type: 'bar',
            label: 'Mean High Temps (°F)',
            backgroundColor: getRandomColor(),
            data: [
              Number(object.meanOfHighTempsCurrentYear.replace(/°F/g, '')),
              Number(object.meanOfHighTempsFutureYear.replace(/°F/g, '')),
            ],
            yAxisID: 'Temperature',
            barPercentage: 0.9,
            categoryPercentage: 0.8,
          },
          {
            type: 'bar',
            label: 'Highest Temp (°F)',
            backgroundColor: getRandomColor(),
            data: [
              Number(object.highestTempOfCurrentYear.replace(/°F/g, '')),
              Number(object.highestTempOfFutureYear.replace(/°F/g, '')),
            ],
            yAxisID: 'Temperature',
            barPercentage: 0.9,
            categoryPercentage: 0.8,
          },
          {
            type: 'line',
            label: 'Total Precipitation (mm)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 10,
            fill: false,
            data: [
              Number(object.totalPrecipitationCurrentYear.replace(/mm/g, '')),
              Number(object.totalPrecipitationFutureYear.replace(/mm/g, '')),
            ],
            yAxisID: 'Precipitation',
            order: -1,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: `Climate Change Indicators for ${object.formattedLocationName}`,
          fontSize: 28,
        },
        legend: {
          labels: {
            fontSize: 24,
          },
        },
        tooltips: {
          mode: 'index',
          intersect: true,
        },
        scales: {
          yAxes: [
            {
              id: 'Temperature',
              type: 'linear',
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Temperature (°F)',
                fontSize: 24,
              },
              ticks: {
                beginAtZero: true,
                fontSize: 22,
              },
            },
            {
              id: 'Precipitation',
              type: 'linear',
              position: 'right',
              gridLines: {
                drawOnChartArea: false,
              },
              scaleLabel: {
                display: true,
                labelString: 'Precipitation (mm)',
                fontSize: 24,
              },
              ticks: {
                beginAtZero: true,
                fontSize: 22,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontSize: 22,
              },
            },
          ],
        },
        layout: {
          padding: {
            top: 10,
            right: 30,
            bottom: 10,
            left: 30,
          },
        },
      },
    };
    const response = await fetch('https://quickchart.io/chart/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chart: chartConfig,
        width: 1024,
        height: 1024,
        backgroundColor: 'white',
      }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const responseData = await response.json();
    const chartImageUrl = responseData.url;
    return chartImageUrl;
  } catch (error) {
    console.error('Error fetching chart image URL:', error);
    throw error;
  }
}
async function getRequest(locationEntry, yearEntry = '2100') {
  const coordsAndNameArr = await getCoordinatesAndFormatName(locationEntry);
  const climateDataObj = await getClimateDetails(coordsAndNameArr, yearEntry);
  const analysis = `Mean of High Temps of ${currentDate}:
  ${climateDataObj.meanOfHighTempsCurrentYear}<br><br>
  Mean of High Temps of ${climateDataObj.futureYear}:
  ${climateDataObj.meanOfHighTempsFutureYear}<br><br>
  Percent Change:
  ${
    (
      ((Number(climateDataObj.meanOfHighTempsFutureYear.replace(/°F/g, '')) -
        Number(climateDataObj.meanOfHighTempsCurrentYear.replace(/°F/g, ''))) /
        Number(climateDataObj.meanOfHighTempsCurrentYear.replace(/°F/g, ''))) *
      100
    ).toFixed(2) + '%'
  }<br><br>
  Highest Temp of ${currentDate}:
  ${climateDataObj.highestTempOfCurrentYear}<br><br>
  Highest Temp of ${climateDataObj.futureYear}:
  ${climateDataObj.highestTempOfFutureYear}<br><br>
  Percent Change:
  ${
    (
      ((Number(climateDataObj.highestTempOfFutureYear.replace(/°F/g, '')) -
        Number(climateDataObj.highestTempOfCurrentYear.replace(/°F/g, ''))) /
        Number(climateDataObj.highestTempOfCurrentYear.replace(/°F/g, ''))) *
      100
    ).toFixed(2) + '%'
  }<br><br>
  Total Precipitation in ${currentDate}:
  ${climateDataObj.totalPrecipitationCurrentYear}<br><br>
  Total Precipitation in ${climateDataObj.futureYear}:
  ${climateDataObj.totalPrecipitationFutureYear}<br><br>
  Percent Change: ${
    (
      ((Number(climateDataObj.totalPrecipitationFutureYear.replace(/mm/g, '')) -
        Number(
          climateDataObj.totalPrecipitationCurrentYear.replace(/mm/g, ''),
        )) /
        Number(
          climateDataObj.totalPrecipitationCurrentYear.replace(/mm/g, ''),
        )) *
      100
    ).toFixed(2) + '%'
  }`;
  const chartImgURL = await fetchChartUrl(climateDataObj);
  return [climateDataObj.formattedLocationName, analysis, chartImgURL];
}
function viewSwap(view) {
  if (view === 'landing-page') {
    $landingPage.setAttribute('class', '');
    $formPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
    $editPage.setAttribute('class', 'hidden');
    $landingForm.reset();
  } else if (view === 'form-page') {
    $formPage.setAttribute('class', '');
    $landingPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
    $editPage.setAttribute('class', 'hidden');
  } else if (view === 'entries-page') {
    $entriesPage.setAttribute('class', '');
    $formPage.setAttribute('class', 'hidden');
    $landingPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
    $editPage.setAttribute('class', 'hidden');
    toggleNoEntries();
  } else if (view === 'loading-page') {
    $loadingPage.setAttribute('class', '');
    $entriesPage.setAttribute('class', 'hidden');
    $formPage.setAttribute('class', 'hidden');
    $landingPage.setAttribute('class', 'hidden');
    $editPage.setAttribute('class', 'hidden');
  } else if (view === 'edit-page') {
    $editPage.setAttribute('class', '');
    $landingPage.setAttribute('class', 'hidden');
    $formPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
  }
}
