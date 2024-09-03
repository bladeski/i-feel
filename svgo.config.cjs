/** @type {import('svgo').Config} */
module.exports = {
    plugins: [
      {
        name: "inlineStyles",
        params: {
          onlyMatchedOnce: false,
          removeMatchedSelectors: true
        }
      }
    ],
  };
  