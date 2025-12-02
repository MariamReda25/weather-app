export const getJSON = async function (url) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Invalid Request(${response.statusText})`);

    const data = await response.json();
    if (!data) throw new Error(`No search result found!`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
