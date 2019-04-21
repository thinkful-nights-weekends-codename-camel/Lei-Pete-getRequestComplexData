'use strict';

// put your own value below!
const apiKey = 'qwMChjmVPFEAyYKtZQJOKGBVEkgfEZswQD3dGvv8'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // iterate through the park data
  const toAppend = responseJson.data.map(park => {
    // finding physical address inside park data.address array 
    const address = park.addresses.find(function(address) {
      return address.type === 'Physical';
    });
    // checking if line1, 2, and 3 contain data or is '' (empty string), adding line break if true
    const addressLine1 = `${address.line1 ? address.line1 + '<br>' : ''}`;
    const addressLine2 = `${address.line2 ? address.line2 + '<br>' : ''}`;
    const addressLines = `${addressLine1} ${addressLine2} ${address.line3}`;

    return (
      `<li><h3>${park.fullName}</h3>
      <p>${park.description}</p>
      <a href="${park.url}" target="_blank">${park.url}</a>
      <p>${addressLines}
      ${address.city}, ${address.stateCode} ${address.postalCode}</p>
      </li>`
    );
  });
  
  $('#results-list').html(toAppend);
  //display the results section  
  $('#results').removeClass('hidden');
};

function getNationalParks(stateSearch, maxResults=10) {
  let stateSearchArray = stateSearch.replace(/\s/g,'').split(',');
  const params = {
    api_key: apiKey,
    stateCode: stateSearchArray, // splits search states into array of strings
    fields: 'addresses',
    limit: maxResults
  };

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  // console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const stateSearch = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(stateSearch, maxResults);
  });
}

$(watchForm);
