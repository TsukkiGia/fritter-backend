/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function followUser(fields) {
  fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
  fetch(`/api/follows?followedUser=${fields.userId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function getFollowingList(fields) {
  fetch('/api/follows')
    .then(showResponse)
    .catch(showResponse);
}

function respondFollowRequest(fields) {
  fetch('/api/follows', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
