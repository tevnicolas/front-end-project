# Your-Climate-Future

![License](https://img.shields.io/github/license/tevnicolas/your-climate-future)
![Issues](https://img.shields.io/github/issues/tevnicolas/your-climate-future)
![Stars](https://img.shields.io/github/stars/tevnicolas/your-climate-future)
![Forks](https://img.shields.io/github/forks/tevnicolas/your-climate-future)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Demo](#demo)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Description

Your Climate Future is a front end web application designed for those interested in learning about the future habitability and effects of climate change on a region up to the year 2100.

The application was built with TypeScript and CSS and utilizes the Geoapify API, the BioSIM API and QuickChart API for data realization.

## Features

- **Enter Location using GeoApify API**:

  - Any location entered is identified, validated and formatted correctly before being passed to the BioSIM API, ie. Address by location or location by address.

- **Climate Predictions with BioSIM API**:

  - The BioSIM API is used to gather and analyze climate data, which is essential for understanding and forecasting the impacts of climate change.
  - Displays the mean high temperature for the current year and the predicted mean high for the future year.
  - Calculates the percent change between those two values.
  - Displays the highest temperature of the current year and the predicted highest for the future year.
  - Calculates the percent change between those two values.
  - Displays the total precipitation for the current year and the predicted total for the future year.
  - Calculates the percent change between those two values.

    Note: default future year is 2100. This can be changed in editing mode.

- **Data Visualization with quickly.io API**:

  - To visually represent the climate data, QuickChart API is utilized to generate graphic charts.
  - The mean high temperatures for the current and future years are displayed as bar charts.
  - The highest temperatures for the current and future years are displayed as bar charts.
  - The total precipitation for the current and future years are displayed as a line charts.

- **User Experience**:
  - Designed with a user-friendly interface for easy navigation and use.
  - Efficiently manages data with local storage using JSON

## Demo

![Kapture 2024-05-29 at 21 59 40](https://github.com/tevnicolas/your-climate-future/assets/155599138/97688bcc-4b71-4f71-b54a-533aeb849438)

## Usage

To use Your Climate Future, follow these steps:

1. **Visit the Application**:
   Go to [Your Climate Future](tevnicolas.github.io/your-climate-future/).

2. **Set Location**:

   - Type in a Location, City, Address, etc. to set the region that will be analyzed. Click 'Submit'.

3. **View Results**:

   - Data points and calculated percent change is displayed.
   - A graphical representation also aides in telling the location's climate story.

4. **Edit or Delete Results**:

   - Click 'Edit City/Year' to edit the entry.
   - You can edit the location, or the future year data point (default is 2100).
   - Click 'Save' to regenerate, or 'Revert' to discard changes, or 'Delete' to delete the entry.

5. **View all Entries**:

   - Click 'Entries' in the header to view all of your previous entries.
   - Click on individual entries to view the complete analysis.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact:

Your Name - [tevnicolas@protonmail.com](mailto:tevnicolas@protonmail.com)

Project Link: [https://github.com/tevnicolas/your-climate-future](https://github.com/tevnicolas/your-climate-future)
