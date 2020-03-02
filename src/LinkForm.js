import React from "react";
import PodResultsContainer from "./PodResultsContainer";
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://podlinker.now.sh/"
    : "http://localhost:3001/";

const isItunesEpisodeLink = link => {
  return link.match(/(https:\/\/podcasts\.apple\.com\/us\/podcast\/.*)/g);
};

const isItunesShowLink = link => {
  return link.match(/(https:\/\/podcasts.apple.com\/us\/podcast\/id)\d+/);
};

const itunesIdFromLink = link => {
  const chunks = link.split("/");

  // get id from end of url
  const ids = chunks[chunks.length - 1];

  return ids.match(/\d+/g)[0];
};

const isCastroLink = link => {};

const buildAllFromItunesLink = link => {
  const id = link.match(
    /(https:\/\/podcasts.apple.com\/us\/podcast\/id)(\d+)/
  )[2];

  return {
    itunes: link,
    pocket_casts: `https://pca.st/itunes/${id}`,
    castro: `https://castro.fm/itunes/${id}`,
    overcast: `https://overcast.fm/itunes${id}`,
    spotify: ``,
    castbox: `https://castbox.fm/vic/${id}`,
    breaker: ``,
    radio_public: ``
  };
};

class LinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", title: "", loading: false };
  }

  transform = async input => {
    this.setState({ loading: true });
    await fetch(`${API_URL}api/links?q=${input}`, {
      mode: "cors",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        console.log("RESULTS", res);
        this.setState({ title: res.title, results: res.urls, loading: false });
      })
      .catch(err => console.error(err));
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    const url = this.state.value;

    event.preventDefault();
    this.transform(url);
  };

  render() {
    const { results, value, title, loading } = this.state;
    return (
      <div className="container is-fluid">
        <form onSubmit={this.handleSubmit}>
          <div className="field is-grouped">
            <div className="control is-expanded">
              <input
                type="text"
                className="input is-primary"
                value={value}
                onChange={this.handleChange}
              />
            </div>
            <div className="control">
              <button
                type="submit"
                className={`button is-primary ${loading ? "is-loading" : ""}`}
              >
                Go
              </button>
            </div>
          </div>
        </form>
        {results !== undefined && (
          <PodResultsContainer results={results} title={title} />
        )}
      </div>
    );
  }
}

export default LinkForm;
