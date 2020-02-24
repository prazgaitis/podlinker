import React from "react";

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

  transform = input => {
    if (isItunesShowLink(input)) {
      this.setState({ results: buildAllFromItunesLink(input) });
    }

    if (isItunesEpisodeLink(input)) {
      console.log("iTunes link: ", input);
      let itunesId = itunesIdFromLink(input);

      console.log("Castro link: ", `https://castro.fm/itunes/${itunesId}`);
    }

    if (isCastroLink(input)) {
    }
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    const url = this.state.value;

    event.preventDefault();
    console.log(url, this.transform(url));
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
        </form>
        {results !== undefined && (
          <ul>
            {Object.entries(results).map(res => {
              return (
                <li key={Math.random()}>
                  <a target="_blank" rel="noopener noreferrer" href={res[1]}>
                    {res[0]}
                  </a>
                </li>
              );
            })}
            <li></li>
          </ul>
        )}
      </div>
    );
  }
}

export default LinkForm;
