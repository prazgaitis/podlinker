import React from "react";

const PodResultsContainer = ({ results, title }) => {
  console.log("HUH? ", results);
  return (
    <div>
      <h2 className="title"> {title}</h2>
      <div>
        <div className="tile is-ancestor">
          {results.map(result => {
            const [name, url] = result;
            return (
              <a
                target="_blank"
                rel="noopener noreferrer"
                key={Math.random()}
                href={url}
              >
                <div className="tile is-parent">
                  <article className="tile is-child box">
                    <p className="title">{name}</p>
                  </article>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PodResultsContainer;
