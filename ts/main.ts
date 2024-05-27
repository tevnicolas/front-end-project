interface FormElements extends HTMLFormControlsCollection {
  location: HTMLInputElement;
  futureYear?: HTMLSelectElement;
}

const currentDate = new Date().getFullYear();
let dataEntryIDTarget = 0;
const $landingForm = document.querySelector('.landing-form') as HTMLFormElement;
const $landingFormElements = $landingForm.elements as FormElements;
const $editForm = document.querySelector('#edit-form') as HTMLFormElement;
const $editFormElements = $editForm.elements as FormElements;
const $landingPage = document.querySelector(
  'div[data-view="landing-page"]',
) as HTMLDivElement;
const $formPage = document.querySelector(
  'div[data-view="form-page"]',
) as HTMLDivElement;
const $entriesPage = document.querySelector(
  'div[data-view="entries-page"]',
) as HTMLDivElement;
const $loadingPage = document.querySelector(
  'div[data-view="loading-page"]',
) as HTMLDivElement;
const $editPage = document.querySelector(
  'div[data-view="edit-page"]',
) as HTMLDivElement;
const $formHook = document.querySelector('.form-page') as HTMLDivElement;
const $entriesHook = document.querySelector('.entries-page') as HTMLDivElement;
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
const $saveButtonEditPage = document.querySelector('.edit-page .buttonpos1');
const $revertButtonEditPage = document.querySelector('.edit-page .buttonpos2');
const $deleteButtonEditPage = document.querySelector('.edit-page .buttonpos3');
const $cancelButtonModal = document.querySelector('#cancel');
const $confirmButtonModal = document.querySelector('#confirm');
const $noEntries = document.querySelector('.no-entries') as HTMLDivElement;
const $yearSelect = document.querySelector('#futureYear');
const $editPageDescription = document.querySelector(
  '#edit-form p',
) as HTMLParagraphElement;
const $editPageImage = document.querySelector(
  '.edit-page img',
) as HTMLImageElement;
const $modal = document.querySelector('#delete-modal') as HTMLDialogElement;

if (!$landingForm) throw new Error('$landingform query failed.');
if (!$landingPage) throw new Error('$landingPage query failed.');
if (!$editForm) throw new Error('$editform query failed.');
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
if (!$revertButtonEditPage)
  throw new Error('$revertButtonEditPage query failed.');
if (!$deleteButtonEditPage)
  throw new Error('$deleteButtonEditPage query failed.');
if (!$saveButtonEditPage) throw new Error('$saveButtonEditPage query failed.');
if (!$cancelButtonModal) throw new Error('$cancelButtonModal query failed.');
if (!$confirmButtonModal) throw new Error('$confirmButtonModal query failed.');
if (!$noEntries) throw new Error('$noEntries query failed.');
if (!$yearSelect) throw new Error('$yearSelect query failed.');
if (!$editPageDescription)
  throw new Error('$editPageDescription query failed.');
if (!$editPageImage) throw new Error('$editPageImage query failed.');
if (!$modal) throw new Error('$modal query failed.');

$landingForm.addEventListener('submit', async (event: Event): Promise<void> => {
  event.preventDefault();
  viewSwap('loading-page');
  const entry = await getEntry($landingFormElements.location.value, '2100');
  data.nextEntryId++;
  data.entries.unshift(entry);
  const $newRowTreeFormStyle = render(entry, 'long');
  $formHook.prepend($newRowTreeFormStyle);
  const $newRowTreeEntriesStyle = render(entry, 'short');
  $entriesHook.prepend($newRowTreeEntriesStyle);
  hideEntriesExceptNewIdTarget('last');
  viewSwap('form-page');
  $landingForm.reset();
});

$editForm.addEventListener('submit', async (event: Event): Promise<void> => {
  event.preventDefault();
  if (
    $editFormElements.location.value === data.editing?.formatLocation &&
    $editFormElements.futureYear!.value === data.editing.futureYear
  ) {
    viewSwap('form-page');
  } else {
    viewSwap('loading-page');
    const entry = await getEntry(
      $editFormElements.location.value,
      $editFormElements.futureYear!.value,
    );
    entry.entryId = data.editing?.entryId as number;
    data.editing = entry;
    for (let i = 0; i < data.entries.length; i++) {
      if (data.entries[i].entryId === data.editing.entryId) {
        data.entries[i] = data.editing;
      }
    }
    const $newRowTreeFormStyle = render(entry, 'long');
    const $oldRowTreeFormStyle = $formHook.querySelector(
      'div[data-entry-id="' + String(data.editing.entryId) + '"]',
    );
    if (!$oldRowTreeFormStyle)
      throw new Error('$oldRowTreeFormStyle query failed.');
    $oldRowTreeFormStyle.replaceWith($newRowTreeFormStyle);
    const $newRowTreeEntriesStyle = render(entry, 'short');
    const $oldRowTreeEntriesStyle = $entriesHook.querySelector(
      'div[data-entry-id="' + String(data.editing.entryId) + '"]',
    );
    if (!$oldRowTreeEntriesStyle)
      throw new Error('$oldRowTreeEntriesStyle query failed.');
    $oldRowTreeEntriesStyle.replaceWith($newRowTreeEntriesStyle);
    viewSwap('form-page');
  }
});

$header.addEventListener('click', (event: Event): void => {
  event.preventDefault();
  const $eventTarget = event.target as HTMLElement;
  switch ($eventTarget) {
    case $headerText:
      viewSwap('landing-page');
      break;
    case $entriesText:
      viewSwap('entries-page');
      break;
  }
});

$formPage.addEventListener('click', (event: Event): void => {
  event.preventDefault();
  const $eventTarget = event.target as HTMLElement;
  switch ($eventTarget) {
    case $newEntryButtonFormPage:
      viewSwap('landing-page');
      break;
    case $editButtonFormPage:
      viewSwap('edit-page');
      fillInEditForm();
      break;
  }
});

function fillInEditForm(): void {
  for (const entry of data.entries) {
    if (dataEntryIDTarget === entry.entryId) {
      data.editing = entry;
    }
  }
  $editFormElements.location.value = data.editing?.formatLocation as string;
  $editFormElements.futureYear!.value = data.editing?.futureYear as string;
  $editPageDescription.innerHTML = data.editing?.analysis as string;
  $editPageImage.setAttribute('src', data.editing?.imageURL as string);
  $editFormElements.location.focus();
  $editFormElements.location.select();
}

$entriesPage.addEventListener('click', (event: Event): void => {
  event.preventDefault();
  const $eventTarget = event.target as HTMLElement;
  const $shortRowTarget = $eventTarget.closest(
    '[data-entry-id]',
  ) as HTMLDivElement | null;
  dataEntryIDTarget = Number($shortRowTarget?.getAttribute('data-entry-id'));
  if ($eventTarget === $newEntryButtonEntriesPage) {
    viewSwap('landing-page');
  } else if ($eventTarget.tagName === 'H1') {
    hideEntriesExceptNewIdTarget(dataEntryIDTarget);
    viewSwap('form-page');
  } else if ($eventTarget.tagName === 'I') {
    hideEntriesExceptNewIdTarget(dataEntryIDTarget);
    viewSwap('edit-page');
    fillInEditForm();
  }
});

$editPage.addEventListener('click', (event: Event): void => {
  const $eventTarget = event.target as HTMLElement;
  switch ($eventTarget) {
    case $revertButtonEditPage:
      event.preventDefault();
      viewSwap('form-page');
      break;
    case $deleteButtonEditPage:
      event.preventDefault();
      $modal.showModal();
      break;
    case $cancelButtonModal:
      event.preventDefault();
      $modal.close();
      break;
    case $confirmButtonModal: {
      event.preventDefault();
      const $shortRowTarget = $entriesHook.querySelector(
        'div[data-entry-id="' + String(data.editing?.entryId) + '"]',
      );
      const $rowTarget = $formHook.querySelector(
        'div[data-entry-id="' + String(data.editing?.entryId) + '"]',
      );
      $shortRowTarget?.remove();
      $rowTarget?.remove();
      for (let i = 0; i < data.entries.length; i++) {
        if (data.entries[i].entryId === data.editing?.entryId) {
          data.entries.splice(i, 1);
        }
      }
      $modal.close();
      viewSwap('entries-page');
      break;
    }
  }
});

document.addEventListener('DOMContentLoaded', (): void => {
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
  toggleNoEntries();
  viewSwap(data.view); // not certain why this is here yet
  $landingForm.reset(); // also not 100% if this needs to be here
});

function render(entry: Entry, option: string): HTMLDivElement {
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
  $image.setAttribute('src', entry.imageURL);
  $image.setAttribute('alt', entry.formatLocation);
  const $divColHalf2 = document.createElement('div');
  $divColHalf2.setAttribute('class', 'column-half');
  const $divTextual = document.createElement('div');
  $divTextual.setAttribute('class', 'textual');
  const $locationHeading = document.createElement('h1');
  $locationHeading.setAttribute('class', pointer);
  $locationHeading.textContent = entry.formatLocation;
  const $description = document.createElement('p');
  $description.setAttribute('class', pType);
  $description.innerHTML = entry.analysis;
  const $editIcon = document.createElement('i');
  $editIcon.setAttribute('class', 'fa fa-edit');

  $divTextual.appendChild($locationHeading);
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

function hideEntriesExceptNewIdTarget(option: string | number): void {
  const $listOfFormEntries = $formHook.querySelectorAll(
    '[data-entry-id]',
  ) as NodeListOf<HTMLElement>;
  const lastEntryId = Number($listOfFormEntries[0].dataset.entryId);
  const firstEntryId = Number(
    $listOfFormEntries[$listOfFormEntries.length - 1].dataset.entryId,
  );
  if (option === 'last') {
    dataEntryIDTarget = lastEntryId;
  } else {
    dataEntryIDTarget = option as number;
  }
  for (let i = firstEntryId; i <= lastEntryId; i++) {
    const $hideOtherEntries = $formHook.querySelector(
      `div[data-entry-id="${i}"]`,
    );
    if (i !== dataEntryIDTarget) {
      $hideOtherEntries?.setAttribute('class', 'row hidden');
    } else {
      $hideOtherEntries?.setAttribute('class', 'row');
    }
  }
}

function toggleNoEntries(): void {
  const $listOfEntriesEntries =
    $entriesHook.querySelectorAll('[data-entry-id]');
  if ($listOfEntriesEntries.length === 0) {
    $noEntries.setAttribute('class', 'column-full no-entries');
  } else {
    $noEntries.setAttribute('class', 'column-full no-entries hidden');
  }
}

async function getCoordsAndFormatLocation(
  locationEntry: string,
): Promise<{ lat: number; long: number; formatLocation: string }> {
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
    const formatLocation: string = result.features[0].properties.formatted;
    const coordsArr: number[] = result.features[0].geometry.coordinates;
    return { lat: coordsArr[1], long: coordsArr[0], formatLocation };
  } catch (error) {
    console.log('Throw getCoords() Error', error);
    throw error;
  }
}

interface Temps {
  formatLocationName: string;
  meanOfHighTempsCurrentYear: string;
  highestTempOfCurrentYear: string;
  totalPrecipitationCurrentYear: string;
  futureYear: string;
  meanOfHighTempsFutureYear: string;
  highestTempOfFutureYear: string;
  totalPrecipitationFutureYear: string;
}

async function getClimateData(
  coordsAndFormatLocation: {
    lat: number;
    long: number;
    formatLocation: string;
  },
  futureYear: string,
): Promise<Temps> {
  try {
    // Encode the target URL with the appropriate route, parameters, and model
    const targetUrl = encodeURIComponent(
      `http://repicea.dynu.net/biosim/BioSimWeather?lat=` +
        `${coordsAndFormatLocation.lat}&long=${coordsAndFormatLocation.long}` +
        `&from=${currentDate}&to=2100&model=Climatic` +
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

    const climateData: Temps = {
      formatLocationName: coordsAndFormatLocation.formatLocation as string,
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

    return climateData;
  } catch (error) {
    console.log('Throw getClimateData Error', error);
    throw error;
  }
}

function getRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

async function getChartUrl(climateData: Temps): Promise<string> {
  try {
    const chartConfig = {
      type: 'bar',
      data: {
        labels: [currentDate, climateData.futureYear],
        datasets: [
          {
            type: 'bar',
            label: 'Mean High Temps (°F)',
            backgroundColor: getRandomColor(),
            data: [
              Number(climateData.meanOfHighTempsCurrentYear.replace(/°F/g, '')),
              Number(climateData.meanOfHighTempsFutureYear.replace(/°F/g, '')),
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
              Number(climateData.highestTempOfCurrentYear.replace(/°F/g, '')),
              Number(climateData.highestTempOfFutureYear.replace(/°F/g, '')),
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
              Number(
                climateData.totalPrecipitationCurrentYear.replace(/mm/g, ''),
              ),
              Number(
                climateData.totalPrecipitationFutureYear.replace(/mm/g, ''),
              ),
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
          text: `Climate Change Indicators for ${climateData.formatLocationName}`,
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

function getAnalysis(climateData: Temps): string {
  return `Mean of High Temps of ${currentDate}:
  ${climateData.meanOfHighTempsCurrentYear}<br><br>
  Mean of High Temps of ${climateData.futureYear}:
  ${climateData.meanOfHighTempsFutureYear}<br><br>
  Percent Change:
  ${
    (
      ((Number(climateData.meanOfHighTempsFutureYear.replace(/°F/g, '')) -
        Number(climateData.meanOfHighTempsCurrentYear.replace(/°F/g, ''))) /
        Number(climateData.meanOfHighTempsCurrentYear.replace(/°F/g, ''))) *
      100
    ).toFixed(2) + '%'
  }<br><br>
  Highest Temp of ${currentDate}:
  ${climateData.highestTempOfCurrentYear}<br><br>
  Highest Temp of ${climateData.futureYear}:
  ${climateData.highestTempOfFutureYear}<br><br>
  Percent Change:
  ${
    (
      ((Number(climateData.highestTempOfFutureYear.replace(/°F/g, '')) -
        Number(climateData.highestTempOfCurrentYear.replace(/°F/g, ''))) /
        Number(climateData.highestTempOfCurrentYear.replace(/°F/g, ''))) *
      100
    ).toFixed(2) + '%'
  }<br><br>
  Total Precipitation in ${currentDate}:
  ${climateData.totalPrecipitationCurrentYear}<br><br>
  Total Precipitation in ${climateData.futureYear}:
  ${climateData.totalPrecipitationFutureYear}<br><br>
  Percent Change: ${
    (
      ((Number(climateData.totalPrecipitationFutureYear.replace(/mm/g, '')) -
        Number(climateData.totalPrecipitationCurrentYear.replace(/mm/g, ''))) /
        Number(climateData.totalPrecipitationCurrentYear.replace(/mm/g, ''))) *
      100
    ).toFixed(2) + '%'
  }`;
}

async function getEntry(
  locationEntry: string,
  futureYearEntry: string,
): Promise<Entry> {
  const coordsAndFormatLocation =
    await getCoordsAndFormatLocation(locationEntry);
  const climateData = await getClimateData(
    coordsAndFormatLocation,
    futureYearEntry,
  );
  const analysis = getAnalysis(climateData);
  const imageURL = await getChartUrl(climateData);

  return {
    formatLocation: climateData.formatLocationName,
    futureYear: futureYearEntry,
    analysis,
    imageURL,
    entryId: data.nextEntryId,
  };
}

function viewSwap(view: string): void {
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
    adjustEditFormHeading(); // necessary
    $editPage.setAttribute('class', '');
    $landingPage.setAttribute('class', 'hidden');
    $formPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
  }
}

function adjustEditFormHeading(): void {
  viewSwap('form-page'); // necessary
  const $editFormHeading = document.querySelector(
    '.edit-form-heading',
  ) as HTMLDivElement;
  const $formPageHeading = $formHook.querySelector(
    `div[data-entry-id="${dataEntryIDTarget}"] h1`,
  ) as HTMLHeadingElement;
  console.log($formPageHeading);
  if (!$editFormHeading) throw new Error('$editFormHeading query failed.');
  if (!$formPageHeading) throw new Error('$formPageHeading query failed.');
  const formPageHeadingHeight = $formPageHeading.offsetHeight;
  console.log(formPageHeadingHeight);
  $editFormHeading.style.height = String(formPageHeadingHeight + 23) + 'px';
}
