import querystring from 'query-string';
import React from 'react';
import { Link } from 'react-router-dom';

const { parse, stringify } = querystring;
// TODO: Rename
const Url = (props) => {
  return (
    <Link>
      {/* {(routingProps) => {
        console.log('routingProps', routingProps);
        const { sqon: sqonString, ...searchParams } = parse(routingProps?.location?.search);
        const currentUrlSqon = sqonString ? JSON.parse(sqonString) : null;
        const setUrlSQON = (newSqon) => {
          routingProps.history.push({
            search: stringify({
              ...searchParams,
              ...(newSqon && { sqon: JSON.stringify(newSqon) }),
            }),
          });
        };

        return props.render({
          history: routingProps.history,
          urlSqon: currentUrlSqon,
          setUrlSQON,
        });
      }} */}
    </Link>
  );
};

export default Url;
