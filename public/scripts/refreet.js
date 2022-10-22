/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewRefreetsForFreet(fields) {
  fetch(`/api/refreets?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function refreet(fields) {
  fetch('/api/refreets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unrefreet(fields) {
  fetch(`/api/refreets?freetId=${fields.freetId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
