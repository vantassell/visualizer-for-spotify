/*
 * NOTE: Assumes you'll pass in something like "/query" that includes "/"
 * @param {splitToken} string used for split
 * @return void does the redirect
 */
export function redirectToBeforeSplitToken(splitToken) {
  // const path = getNewPath(splitToken);
  window.location.redirect(getNewPath(splitToken));
}

export function replaceToBeforeSplitToken(splitToken) {
  // const path = getNewPath(splitToken);
  window.location.replace(getNewPath(splitToken));
}

function getNewPath(splitToken) {
  const originURL = window.location.href.toString();
  console.log(`originURL: ${originURL}`)

  const newURL = originURL.split(splitToken)[0];
  console.log(`newURL: ${newURL}`);

  return newURL;
}
