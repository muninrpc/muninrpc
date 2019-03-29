import * as React from 'react';
import Service from './Service';
import Request from './Request';
import Setup from './Setup';

export const Left = (): JSX.Element => {
  return (
    <div className="left">
      <div className="input-header">
        <div className="address-box">
          <h3>Target Server IP</h3>
          <input type="text" placeholder="🍆🍆🍆🍆🍆🍆🍆" />
        </div>
        <div className="upload-box">
          <h3>Upload .proto file</h3>
          <div className="upload-box-contents">
            <label className="file-upload">
              upload
              <input
                type="file"
                className="hide-me"
                placeholder="upload file"
              />
            </label>
            <span className="file-path">
              ./user/lol/butt/lol/butt/lol/butt/lol/butt/lol/butt
            </span>
          </div>
        </div>
      </div>
      <div className="main">
        <Service />
        <Request />
        <Setup />
      </div>
      <div className="footer-left">
        <div className="trail">?</div>
        <div className="connection-display">unary</div>
        <button className="send-button">Send</button>
      </div>
    </div>
  );
};
