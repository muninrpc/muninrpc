import * as React from 'react';

export const Right = (): JSX.Element => {
  return (
    <div className="right">
      <span>
        <h1>MuninRPC</h1>
        <img className="logo" src="./src/assets/raven.png" />
      </span>

      <h2>Server Response</h2>
      <div className="response-display">!!!</div>
      <div className="response-metrics">?</div>
    </div>
  );
};
