import React, { useState } from 'react';

import Downshift from 'downshift';
import Spinner from 'react-spinkit';
import ChainIcon from 'react-icons/lib/fa/chain';
import FBIcon from 'react-icons/lib/fa/facebook';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import LIIcon from 'react-icons/lib/fa/linkedin';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import ShareIcon from 'icons/ShareIcon';

import styles from 'theme/shareButtonStyles';
import { Row, Col } from 'theme/system';

let Bubble = p => <span className="share-button__bubble" {...p} />;

const ItemRow = ({ xcss = '', ...props }) => (
  <Row
    className="share-button__item"
    css={`
      ${xcss};
    `}
    {...props}
  />
);

export default ({ link, error, quote, leftOffset = '-135px' }) => {
  const [copied, setCopied] = useState(false);

  return (
    <Downshift
      render={({ isOpen, toggleMenu }) => (
        <div
          css={`
            position: relative;
            ${styles}
          `}
        >
          <button
            className="share-button__button"
            onClick={() => toggleMenu({}, () => setCopied(false))}
          >
            <ShareIcon fill={'#000'} />
            Share
          </button>
          {isOpen && (
            <Col
              className="share-button__panel"
              css={`
                left: ${leftOffset};
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
                        margin: '0 auto',
                      }}
                    />
                  )}
                </ItemRow>
              ) : (
                <React.Fragment>
                  <ItemRow>
                    <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
                      <span>
                        <Bubble>
                          <ChainIcon />
                        </Bubble>
                        <span>{copied ? 'Copied!' : 'Copy URL'}</span>
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
  );
};
