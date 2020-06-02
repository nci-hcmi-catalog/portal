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
import base from 'theme';
import { Row, Col } from 'theme/system';

const {
  keyedPalette: { elm, lightBlack, lightPorcelain },
  fonts: { openSans },
} = base;

let Bubble = p => (
  <span
    css={`
      display: inline-block;
      background-color: ${elm};
      color: white;
      padding: 2px 4px;
      border-radius: 100%;
      margin-right: 10px;

      svg {
        width: 12px;
        height: 12px;
      }
    `}
    {...p}
  />
);

const ItemRow = ({ xcss = '', ...props }) => (
  <Row
    css={`
      display: flex;
      padding: 0 10px;
      min-height: 28px;
      align-items: center;
      cursor: pointer;
      font-size: 12px;
      &:hover {
        background-color: ${lightPorcelain};
      }
      ${xcss};
    `}
    {...props}
  />
);

export default ({ link, error, quote, leftOffset = '-135px' }) => (
  <Component initialState={{ copied: false }}>
    {({ state, setState }) => (
      <Downshift
        render={({ isOpen, toggleMenu }) => (
          <div
            css={`
              position: relative;
            `}
          >
            <button
              className="pill"
              onClick={() => toggleMenu({}, () => setState({ copied: false }))}
            >
              <ShareIcon height={12} fill={'#000'} />
              Share
            </button>
            {isOpen && (
              <Col
                css={`
                  width: 210px;
                  position: absolute;
                  left: ${leftOffset};
                  background: #fff;
                  box-shadow: 1px 1.7px 4px 0 ${lightBlack};
                  color: black;
                  z-index: 99;

                  > div {
                    font-family: ${openSans} !important;
                  }
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
                          <span>{state.copied ? <span>Copied!</span> : <span>Copy URL</span>}</span>
                        </span>
                      </CopyToClipboard>
                    </ItemRow>
                    <ItemRow>
                      <FacebookShareButton url={link} quote={quote}>
                        <Bubble>
                          <FBIcon />
                        </Bubble>
                        <span>Share on Facebook</span>
                      </FacebookShareButton>
                    </ItemRow>
                    <ItemRow>
                      <Bubble>
                        <TwitterIcon />
                      </Bubble>
                      <TwitterShareButton title={quote} url={link}>
                        <span>Share on Twitter</span>
                      </TwitterShareButton>
                    </ItemRow>
                    <ItemRow>
                      <LinkedinShareButton title={quote} url={link}>
                        <Bubble>
                          <LIIcon />
                        </Bubble>
                        <span>Share on Linkedin</span>
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
