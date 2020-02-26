import React from "react";
import fetch from "node-fetch";

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
    this.state = { value: "" };
  }

  transform = async input => {
    await fetch(`http://paulius.local:3001/api?q=${input}`, {
      mode: "cors",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(res => {
        console.log("RESULTS", res);
        this.setState({ results: res.urls });
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
    const { results, value } = this.state;
    return (
      <div className="container is-fluid">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            className="input is-primary"
            value={value}
            onChange={this.handleChange}
          />
          <button type="submit" className="button is-link">
            Go
          </button>
        </form>
        {results !== undefined && (
          <ul>
            {results.map(item => {
              return (
                <li key={Math.random()}>
                  <a target="_blank" rel="noopener noreferrer" href={item[1]}>
                    {item[0]}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

export default LinkForm;
