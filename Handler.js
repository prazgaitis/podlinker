const fetch = require("node-fetch");
const cheerio = require("cheerio");
const similar = require("string-similarity");
const { URLSearchParams } = require("url");
const Helper = require("./src/Helper");

const spotifyToken = async () => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  if (SPOTIFY_CLIENT_SECRET === undefined || SPOTIFY_CLIENT_ID === undefined) {
    throw new Error("Did you forget to set environment variables?");
  }

  const url = "https://accounts.spotify.com/api/token";
  const baseEncoded = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${baseEncoded}`
    },
    body: params
  };

  const data = await fetch(url, options).then(res => res.json());
  return await data.access_token;
};

// FROM podcast TITLE to SPOTIFY URL
const spotify = async title => {
  const titleSearchString = encodeURI(title);
  const token = await spotifyToken();

  const url = `https://api.spotify.com/v1/search?type=album%2Cartist%2Cplaylist%2Ctrack%2Cshow_audio%2Cepisode_audio&q=${titleSearchString}&decorate_restrictions=false&best_match=true&include_external=audio&limit=10&market=US`;
  const options = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    method: "GET"
  };
  const results = await fetch(url, options)
    .then(res => res.json())
    .then(res => res.episodes.items)
    .catch(err => console.error(err));

  if (!results || results.length === 0) {
    return null;
  } else {
    const pod = await results[0];

    return { url: pod.external_urls.spotify };
  }
};

// FROM Castro link TO iTunes Title & show ID
const castroToItunes = async link => {
  const dom = await fetch(link)
    .then(data => data.text()) // get castro page HTML
    .catch(e => console.error(e));

  const $ = cheerio.load(dom);
  const title = $("h1").text();

  const iTunesId = Array.from($("a")) // get all links
    .map(n => n.attribs.href) // get href strings
    .filter(url => url.match(/http:\/\/pca.st\/itunes\//g))[0] // get the pocketcasts url
    .match(/\d+/)[0]; // get the itunes ID from the pocketcasts url

  return { iTunesId, title };
};

// Get Title from Overcast Episode link
const overcastShowToItunes = async link => {
  const dom = await fetch(link)
    .then(data => data.text())
    .catch(e => console.error(e));

  const $ = cheerio.load(dom);
  const title = $("h2")[0].text();

  const iTunesId = Array.from($("a")) // get all links
    .map(n => n.attribs.href) // get href strings
    .filter(url => url.match(/http:\/\/pca.st\/itunes\//g))[0] // get the pocketcasts url
    .match(/\d+/)[0]; // get the itunes ID from the pocketcasts url

  return { iTunesId, title };
};

// FROM itunes show ID and title TO iTunes Direct link
const main = async (iTunesShowID, podTitle) => {
  // this will probably expire at some point
  const iTunesAuth =
    "Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IldlYlBsYXlLaWQifQ.eyJpc3MiOiJBTVBXZWJQbGF5IiwiaWF0IjoxNTgxMDM0OTI1LCJleHAiOjE1OTY1ODY5MjV9.GHuK3wnRsuXWgHcWnPH7x_eLE82lG11_Zu5pmUvzH-OlunoHqGj3ItgAWwaOg3-fmYPnfRhfu59-mfhf5beZiw";

  const options = {
    credentials: "include",
    headers: {
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9,lt;q=0.8,la;q=0.7,mt;q=0.6",
      authorization: iTunesAuth,
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    referrerPolicy: "no-referrer-when-downgrade",
    body: null,
    method: "GET",
    mode: "cors"
  };
  const count = 100; // this will need to go up
  const offset = 0;
  const url = `https://amp-api.podcasts.apple.com/v1/catalog/us/podcasts/${iTunesShowID}/episodes?offset=${offset}&limit=${count}`;

  const episodes = await fetch(url, options).then(res => res.json());

  const episodeData = episodes.data.map(ep => {
    // pull out name and attributes from episode json
    const { name, url } = ep.attributes;

    return { name, url };
  });

  // compare the title to the list of episodes resturned. Similarity is 1 if titles are identical
  for (const episode of episodeData) {
    const similarity = similar.compareTwoStrings(episode.name, podTitle);

    if (similarity === 1) {
      return episode;
    }
  }
  return null;
};

const buildLinks = async (type, platform, link) => {
  var links = [];

  if (type === "episode") {
    if (platform === "castro") {
      // get title and iTunes Id
      const { title, iTunesId } = await castroToItunes(link);
      links.push(["castro", link]);

      const { url } = await main(iTunesId, title);
      links.push(["itunes", url]);

      const spotifyResult = await spotify(title);
      links.push(["spotify", spotifyResult.url]);
    } else if (platform == "overcast") {
      const { title, iTunesId } = await overcastShowToItunes(link);

      links.push(["overcast", link]);

      const { url } = await main(iTunesId, title);
      links.push(["itunes", url]);

      const spotifyResult = await spotify(title);
      links.push(["spotify", spotifyResult.url]);
    }
  }

  // TODO: add other platforms here

  return { title: title, result: links };
};

const Handler = {
  handle: async (req, res) => {
    if (process.env.NODE_ENV === "development") {
      const { type, platform } = Helper.detect(req.query.q);
      console.log(`type: ${type}, platform: ${platform}`);

      var urls = [
        ["spotify", "https://www.spotify.com"],
        ["itunes", "https://www.itunes.com"],
        ["overcast", "https://overcast.fm"],
        ["castro", "https://castro.fm"]
      ];
      res.status(200).json({ title: "Podcast title here", urls });
      return;
    }
    console.log(req.query);

    const startingUrl = req.query.q;
    const { type, platform } = Helper.detect(startingUrl);

    if (type === "unknown" || platform === "unknown") {
      res
        .status(503)
        .json({ error: "Sorry, I wasn't able to find any links!" });

      return;
    }
    const { title, result } = await buildLinks(type, platform, startingUrl);

    console.log("RESULT", result);
    res.status(200).json({ title: title, urls: result });
  }
};

module.exports = Handler;
