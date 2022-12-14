/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'change-privacy': changePrivacy,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freet-bin': viewFreetBin,
  'search-freets': searchFreets,
  'get-freet': getFreet,
  'get-freet-comments': getFreetComments,
  'update-freet-comments': updateFreetComments,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'a-new-beginning': aNewBeginning,
  'create-freet-comment': createFreetComment,
  'like-freet': likeFreet,
  'view-likes-for-freet': viewLikesForFreet,
  'unlike-freet': unlikeFreet,
  'refreet-freet': refreet,
  'unrefreet-freet': unrefreet,
  'view-refreets-for-freet': viewRefreetsForFreet,
  'update-refreets-of-freet': updateRefreets,
  'view-refreets-by-user': viewRefreetsForUser,
  'view-downvotes-for-freet': getDownvotesForFreet,
  'downvote-freet': downvoteFreet,
  'remove-downvote-from-freet': removeDownvoteFromFreet,
  'follow-user': followUser,
  'unfollow-user': unfollowUser,
  'get-following-list': getFollowingList,
  'respond-follow-request': respondFollowRequest,
  'post-notification': postNotification,
  'respond-follow-notification': updateNotification,
  'get-notifications': viewNotificationsForUser,
  'hide-freet': hideFreet,
  'get-hidden-freets': getHiddenFreetsForUser,
  'get-user-info': getUser,
  'search-users': searchUsers
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
