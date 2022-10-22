
/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function hideFreet(fields) {
  fetch('/api/hiddenfreets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function getHiddenFreetsForUser(fields) {
  fetch('/api/hiddenfreets')
    .then(showResponse)
    .catch(showResponse);
}
