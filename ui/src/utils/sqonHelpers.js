import { addInSQON, removeSQON } from '@arranger/components/dist/SQONView/utils';

export const filterExpanded = (sqon, showExpandedStatus = false) => {
  return showExpandedStatus ? sqon : removeSQON('expanded', sqon);
};

export const toggleExpanded = (sqon, showUnexpanded = false) => {
  return showUnexpanded
    ? removeSQON('expanded', sqon)
    : addInSQON(
        {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'expanded',
                value: ['true'],
              },
            },
          ],
        },
        sqon,
      );
};
