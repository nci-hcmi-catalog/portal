import React from 'react';

import Downshift from 'downshift';
import Spinner from 'react-spinkit';
import ChainIcon from 'react-icons/lib/fa/chain';
import FBIcon from 'react-icons/lib/fa/facebook';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import LIIcon from 'react-icons/lib/fa/linkedin';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import Component from 'react-component-component';

import ShareIcon from 'icons/ShareIcon';
import { Row, Col } from 'theme/system';

let Bubble = p => (
  <span
    css={`
      background-color: rgb(144, 0, 0, 0.7);
      color: white;
      padding: 4px 6px;
      border-radius: 100%;
      margin-right: 10px;
    `}
    {...p}
  />
);

const ItemRow = ({ xcss = '', ...props }) => (
  <Row
    css={`
      display: flex;
      min-height: 37px;
      padding: 0 10px;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: rgb(240, 240, 240);
      }
      ${xcss};
    `}
    {...props}
  />
);

export default ({ link, error, quote }) => (
  <Component initialState={{ copied: false }}>
    {({ state, setState }) => (
      <Downshift
        render={({ isOpen, toggleMenu }) => (
          <div>
            <div className="pill" onClick={() => toggleMenu({}, () => setState({ copied: false }))}>
              <ShareIcon height={13} />Share
            </div>
            {isOpen && (
              <Col
                css={`
                  width: 210px;
                  position: absolute;
                  right: 138px;
                  background: white;
                  color: black;
                `}
              >
                {!link ? (
                  <ItemRow style={{ padding: '10px 0' }}>
                    {error ? (
                      <span>Sorry something went wrong.</span>
                    ) : (
                      <Spinner
                        fadeIn="none"
                        name="circle"
                        style={{
                          width: 15,
                          height: 15,
                          marginRight: 9,
                        }}
                      />
                    )}
                  </ItemRow>
                ) : (
                  <React.Fragment>
                    <ItemRow>
                      <CopyToClipboard text={link} onCopy={() => setState({ copied: true })}>
                        <span>
                          <Bubble>
                            <ChainIcon />
                          </Bubble>
                          <span>{state.copied ? <span>Copied!</span> : <span>copy URL</span>}</span>
                        </span>
                      </CopyToClipboard>
                    </ItemRow>
                    <ItemRow>
                      <FacebookShareButton url={link} quote={quote}>
                        <Bubble>
                          <FBIcon />
                        </Bubble>
                        <span>share on facebook</span>
                      </FacebookShareButton>
                    </ItemRow>
                    <ItemRow>
                      <Bubble>
                        <TwitterIcon />
                      </Bubble>
                      <TwitterShareButton title={quote} url={link}>
                        <span>share on twitter</span>
                      </TwitterShareButton>
                    </ItemRow>
                    <ItemRow>
                      <LinkedinShareButton title={quote} url={link}>
                        <Bubble>
                          <LIIcon />
                        </Bubble>
                        <span>share on linkedin</span>
                      </LinkedinShareButton>
                    </ItemRow>
                  </React.Fragment>
                )}
              </Col>
            )}
          </div>
        )}
      />
    )}
  </Component>
);
