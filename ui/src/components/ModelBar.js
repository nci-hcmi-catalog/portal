import React from 'react';

import { Row } from 'theme/system';
import ModelCarousel from 'components/ModelCarousel';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import Url from 'components/Url';
import BackToSearch from 'components/links/BackToSearch';
import ModelList from 'components/ModelList';

//TODO: Uncomment when expanded is available
// const ExpandedPill = ({ isExpanded }) => {
//   return (
//     <div
//       css={`
//         margin-left: 30px;
//         color: ${isExpanded ? theme.keyedPalette.green : theme.keyedPalette.redOrange};
//         font-size: 13px;
//         font-weight: bold;
//         font-family: Helvetica;
//         font-weight: bold;
//         line-height: 1.9;
//         letter-spacing: 0.2px;
//         background-color: white;
//         border-radius: 10px;
//         border: solid 2px ${isExpanded ? '#72bb74' : '#ff9752'};
//         padding: 0px 11px;
//         margin-top: 0px;
//       `}
//     >
//       {isExpanded ? 'EXPANDED' : 'UNEXPANDED'}
//     </div>
//   );
// };

export default ({ name, isExpanded }) => (
  <Url
    render={({ sqon, history }) => (
      <Row
        className="model-bar"
        css={`
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: row;
            align-items: center;
          `}
        >
          <h2>Model {name}</h2>
          {/* TODO: Remove comment when isExpanded is available
          isExpanded === null || isExpanded === undefined ? null : (
            <ExpandedPill isExpanded={isExpanded} />
          )*/}
        </div>

        {sqon && <ModelCarousel modelName={name} sqon={sqon} />}

        <div className="model-bar-actions">
          <BackToSearch sqon={sqon} history={history}>
            <ArrowLeftIcon /> BACK TO SEARCH
          </BackToSearch>
          <ModelList className="model-bar-model-list" />
        </div>
      </Row>
    )}
  />
);
