/*
 */
const fetch = require("node-fetch");

const main = async () => {
  let results = [];
  const options = {
    credentials: "include",
    headers: {
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9,lt;q=0.8,la;q=0.7,mt;q=0.6",
      authorization:
        "Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IldlYlBsYXlLaWQifQ.eyJpc3MiOiJBTVBXZWJQbGF5IiwiaWF0IjoxNTgxMDM0OTI1LCJleHAiOjE1OTY1ODY5MjV9.GHuK3wnRsuXWgHcWnPH7x_eLE82lG11_Zu5pmUvzH-OlunoHqGj3ItgAWwaOg3-fmYPnfRhfu59-mfhf5beZiw",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    referrer: "https://podcasts.apple.com/us/podcast/id315114957",
    referrerPolicy: "no-referrer-when-downgrade",
    body: null,
    method: "GET",
    mode: "cors"
  };
  const count = 2;
  const offset = 0;
  const url = `https://amp-api.podcasts.apple.com/v1/catalog/us/podcasts/315114957/episodes?offset=${offset}&limit=${count}`;
  const data = await fetch(url, options)
    .then(res => res.json())
    .then(res => res.data.map(pod => results.push(pod)));

  console.log(results[0]);
};

main();
