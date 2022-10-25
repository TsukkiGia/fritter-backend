/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFreetBin(fields) {
  fetch('/api/freets/freetbin')
    .then(showResponse)
    .catch(showResponse);
}

function viewAllFreets(fields) {
  fetch('/api/freets')
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByAuthor(fields) {
  fetch(`/api/freets?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function searchFreets(fields) {
  fetch(`/api/freets?freetContains=${fields.freetContains}`)
    .then(showResponse)
    .catch(showResponse);
}

function aNewBeginning(fields) {
  fetch('/api/freets', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function getFreet(fields) {
  fetch(`/api/freets/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function getFreetComments(fields) {
  fetch(`/api/freets/${fields.id}/comments`)
    .then(showResponse)
    .catch(showResponse);
}

function updateFreetComments(fields) {
  fetch(`/api/freets/${fields.id}/comments`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function createFreet(fields) {
  fetch('/api/freets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function createFreetComment(fields) {
  fetch(`/api/freets/${fields.id}/comments`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

