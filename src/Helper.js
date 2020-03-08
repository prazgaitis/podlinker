const CASTRO_EPISODE_REGEX = /https:\/\/castro.fm\/episode\/\w+/g;
const CASTRO_SHOW_REGEX = /https:\/\/castro.fm\/podcast\/.+/g;

const ITUNES_EPISODE_REGEX = /https:\/\/podcasts.apple.com\/\w+\/podcast\/.+/g;
const ITUNES_SHOW_REGEX = ITUNES_EPISODE_REGEX;

const SPOTIFY_SHOW_REGEX = /https:\/\/open.spotify.com\/show\/\w+/g;
const SPOTIFY_EPISODE_REGEX = /https:\/\/open.spotify.com\/episode\/\w+/g;

const OVERCAST_SHOW_REGEX = /https:\/\/overcast.fm\/itunes\d+/g;
const OVERCAST_EPISODE_REGEX = /https:\/\/overcast.fm\/\+\w+/g;

const Helper = {
  detect: link => {
    if (link.match(CASTRO_EPISODE_REGEX)) {
      return { type: "episode", platform: "castro" };
    } else if (link.match(ITUNES_EPISODE_REGEX)) {
      return { type: "episode", platform: "itunes" };
    } else if (link.match(SPOTIFY_EPISODE_REGEX)) {
      return { type: "episode", platform: "spotify" };
    } else if (link.match(OVERCAST_EPISODE_REGEX)) {
      return { type: "episode", platform: "overcast" };
      // check if its a show url
    } else if (link.match(ITUNES_SHOW_REGEX)) {
      return { type: "show", platform: "itunes" };
    } else if (link.match(SPOTIFY_SHOW_REGEX)) {
      return { type: "show", platform: "spotify" };
    } else if (link.match(OVERCAST_SHOW_REGEX)) {
      return { type: "show", platform: "overcast" };
    } else {
      return { type: "unknown", platform: "unknown" };
    }
  }
};

module.exports = Helper;
