/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function getDownvotesForFreet(fields) {
  fetch(`/api/downvotes?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function downvoteFreet(fields) {
  fetch('/api/downvotes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function removeDownvoteFromFreet(fields) {
  fetch(`/api/downvotes?freetId=${fields.freetId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
