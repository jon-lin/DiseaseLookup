# DiseaseLookup
* [Live link][live-link]

## Description
An app built in three days allowing users to examine medical research data from [PubMed][pubmedURL] and [ClinicalTrials.gov][trialsURL] in connection with a specific [MeSH][mesh-link] disease category.

## Features

Users can...
* See MeSh subcategories of a MeSH disease category in a draggable force diagram
* Compare search results for diseases to get an idea of the relative amount of research and clinical trials for different categories
* Discover the most commonly used terms in the 50 most recent PubMed journal articles in connection to a disease category

## Technologies/Libraries Used
* Node.js
* PubMed and ClinicalTrials.gov APIs
* PostgresSQL (connected to [AACT cloud database][aact-link])
* React.js
  * react-router-dom  
  * react-viewport-slider
  * react-particles-js (splash page background)
* Webpack
* D3.js (force diagram, barchart, word cloud)
  * D3 barcharts can take in new data and update dynamically
* [D3 Cloud][d3-cloud] (Code based off of [demo][d3-cloud-demo])
* jQuery
* CSS3
* xml2js (XML to JSON converter)

## GIF of App in Action

<img src="/gifsandpics/disease-lookup-gif-demo.gif"></img>

## Challenges/Solutions

### Backend

#### Challenge: Fetch MeSH search results directly from PubMed and ClinicalTrials.gov APIs (rather than using static data)

##### ClinicalTrials.gov
* ClinicalTrials.gov has a cloud database called AACT that I tried to use to get the same search results I get when I search for specific conditions/diseases on their website (such as "Cardiovascular Diseases" or "Eye Diseases" between 2015-2016).
* But I wasn't getting the same results, so I decided to have my backend fetch XMLs of those results, since ClinicalTrials.gov provided [docs][trials-api-docs] about how to carry out that approach with a regular GET request and query string parameters.
* Meanwhile, because the XMLs don't include full descriptions of each clinical trial, I wanted to find some other way to fetch them.
* In the end, my solution was to connect my backend to the AACT cloud database just for that purpose.
* After getting each trial's unique nct_id from the initial XML fetching, I'm able to use all of the trials' ids to then obtain their corresponding descriptions from AACT. While I built out this connection, I ended up not having enough time to actually use the functionality.

##### PubMed
* PubMed offered a [somewhat more straightforward way][pubmed-api-docs] of getting all the data for multiple articles in one shot. It involves first getting the result of a "ESearch" request, and then using that to put together an "EFetch" request for articles appearing in those results. Their example was in Perl, so I wrote a JS version of it for my Node backend.
* I converted the XMLs I received from PubMed and ClinicalTrials.gov to JSONs using a library, and then wrote my own code to format those JSONs for easier access before serving it to any requests from my frontend.

### Frontend

#### Challenge: Update/customize react-viewport-slider library
* I wanted a viewport slider for my app, so I was happy to find the react-viewport-slider library. But parts of it were deprecated and/or didn't really comport with my vision for my app's UI. So I manually disabled some of its components and updated other things (ex: prop-types is now a separate package from React, so it had to be separately npm installed and imported).

#### Challenge: Build D3 force diagram of MeSH categories
* To start off the slides in my app, I wanted to build a component with some simpler data to help a user see what MeSH terms fall under the MeSH disease category they picked.
* So I webscraped [this PubMed webpage][webscraping-link] to get the immediate MeSH children of the MeSH disease categories. I then worked off Scott Murray's demo of a simple force layout to build out the ForceDiagram component.
* I opted to keep and use a static copy of the formatted data in my project, since it's not a lot of data.

#### Challenge: Build dynamically updating D3 barcharts in a React environment
* Styling the barcharts was difficult mainly because of the other elements they're surrounded by, but it was also somewhat messy to write D3 code (i.e., the whole enter and update pattern) within a React component.
* The other thing that made this difficult was D3 already has a rerender capability that's independent of React's. To deal with this, I decided to have the component only rerender upon mounting, and then having D3 handle taking in additional data fetched from the backend.

## Potential Next Steps
* Reconfigure the D3 word cloud so users can repeatedly add as many articles' abstracts/titles as they want while the visualization smoothly updates
* Add a map slide leveraging Google Maps API showing where the clinical trials are for a given disease category, or allowing people to search for trials near them
* Add a slide with a scatterplot showing how the number of clinical trials and journal articles have changed over time
* Improve the app's responsiveness to window size changes; optimize for mobile viewing

[live-link]: https://diseaselookup.herokuapp.com/
[aact-link]: https://aact-prod.herokuapp.com/connect
[d3-cloud]: https://github.com/jasondavies/d3-cloud
[d3-cloud-demo]: https://bl.ocks.org/blockspring/847a40e23f68d6d7e8b5
[mesh-link]: https://www.nlm.nih.gov/pubs/factsheets/mesh.html
[pubmedURL]: https://www.ncbi.nlm.nih.gov/pubmed
[trialsURL]: https://clinicaltrials.gov/
[trials-api-docs]: https://clinicaltrials.gov/ct2/resources/download#DownloadMultipleRecords
[pubmed-api-docs]: https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.ESearch__ESummaryEFetch
[webscraping-link]: https://www.ncbi.nlm.nih.gov/mesh/1000067
