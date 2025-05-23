import React from 'react';
import Component from 'react-component-component';
import { List, Toggle } from 'theme/searchStyles';

const TableList = ({
  value = [],
  style,
  liStyle,
  toggleStyle,
  limit = 2,
  expandText = `${(value ? value : []).length - limit} more`,
  collapseText = 'less',
}) => (
  <Component
    initialState={{
      expanded: false,
    }}
  >
    {({ state: { expanded }, setState }) =>
      value?.length > 0 ? (
        <List style={style || {}}>
          {value.slice(0, expanded ? value?.length : limit).map((d, i) => (
            <div key={i} style={liStyle}>
              {d}
            </div>
          ))}
          {value.length > limit && (
            <Toggle
              style={toggleStyle}
              onClick={() =>
                setState((state) => ({
                  expanded: !state.expanded,
                }))
              }
            >
              {expanded ? `\u25B4 ${collapseText}` : `\u25BE ${expandText}`}
            </Toggle>
          )}
        </List>
      ) : (
        'N/A'
      )
    }
  </Component>
);

export default TableList;
