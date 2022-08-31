import React from 'react';
import { Route } from 'react-router-dom';
import { parse, stringify } from 'query-string';

const Url = props => (
  <Route>
    {p => {
      let search = parse(p.location.search);
      if (search.sqon) search.sqon = JSON.parse(search.sqon);
      return props.render({
        history: p.history,
        sqon: search.sqon,
        setSQON: sqon => {
          p.history.push({ search: stringify({ ...search, sqon: JSON.stringify(sqon) }) });
        },
      });
    }}
  </Route>
);

export default Url;
