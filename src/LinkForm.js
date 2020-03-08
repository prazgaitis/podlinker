import React from "react";
import PodResultsContainer from "./PodResultsContainer";
import Helper from "./Helper";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://podlinker.now.sh/"
    : "http://localhost:3001/";

const CASTRO_EPISODE_REGEX = /https:\/\/castro.fm\/episode\/.+/g;
const CASTRO_SHOW_REGEX = /https:\/\/castro.fm\/podcast\/.+/g;

const isItunesEpisodeLink = link => {
  return link.match(/(https:\/\/podcasts\.apple\.com\/us\/podcast\/.*)/g);
};

const isItunesShowLink = link => {
  return link.match(/(https:\/\/podcasts.apple.com\/us\/podcast\/id)\d+/);
};

const isCastroShow = link => {
  return link.match(CASTRO_SHOW_REGEX);
};
const isCastroEpisode = link => {
  return link.match(CASTRO_EPISODE_REGEX);
};

class LinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      title: "",
      loading: false,
      detectedPlatform: null,
      detectedType: null
    };
  }

  detect = value => {
    // reset if input is reset
    const { type, platform } = Helper.detect(value);

    if (type === "unknown" && platform === "unknown") {
      this.setState({ detectedPlatform: null, detectedType: null });
    } else {
      this.setState({ detectedPlatform: platform, detectedType: type });
    }
  };

  transform = async input => {
    this.setState({ loading: true });
    await fetch(`${API_URL}api/links?q=${input}`, {
      mode: "cors",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ title: res.title, results: res.urls, loading: false });
      })
      .catch(err => console.error(err));
  };

  handleChange = event => {
    const { value } = event.target;
    this.detect(value);
    this.setState({ value: value });
  };

  handleSubmit = event => {
    const url = this.state.value;

    event.preventDefault();
    this.transform(url);
  };

  render() {
    const {
      results,
      value,
      title,
      loading,
      detectedPlatform,
      detectedType
    } = this.state;
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
          {detectedPlatform !== null && detectedType !== null && (
            <p className="help is-primary">
              {`Detected ${detectedPlatform} ${detectedType} link`}
            </p>
          )}
        </form>
        {results !== undefined && (
          <PodResultsContainer results={results} title={title} />
        )}
      </div>
    );
  }
}

export default LinkForm;
