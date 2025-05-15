import { useArrangerData } from '@overture-stack/arranger-components/';
import { parse, stringify } from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const Url = (props) => {
  const { sqon: arrangerSqon } = useArrangerData();
  return (
    <Route>
      {(p) => {
        let search = parse(p.location.search);
        if (search.sqon) {
          search.sqon = JSON.parse(search.sqon);
        } else if (arrangerSqon) {
          search.sqon = arrangerSqon;
        }
        return props.render({
          history: p.history,
          sqon: search.sqon,
          setSQON: (newSqon) => {
            p.history.push({ search: stringify({ ...search, sqon: JSON.stringify(newSqon) }) });
          },
        });
      }}
    </Route>
  );
};

export default Url;
