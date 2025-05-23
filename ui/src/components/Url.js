import { parse, stringify } from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const Url = (props) => {
  return (
    <Route>
      {(routingProps) => {
        const { sqon: sqonString, ...searchParams } = parse(routingProps.location.search);
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
      }}
    </Route>
  );
};

export default Url;
