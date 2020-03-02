import React from "react";

const PodResultsContainer = ({ results, title }) => {
  console.log("HUH? ", results);
  return (
    <div>
      <h2 className="title"> {title}</h2>
      <div>
        <div class="tile is-ancestor">
          {results.map(result => {
            const [name, url] = result;
            return (
              <a target="_blank" rel="noopener noreferrer" href={url}>
                <div class="tile is-parent">
                  <article class="tile is-child box">
                    <p class="title">{name}</p>
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
