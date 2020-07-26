import { removeSQON } from '@arranger/components/dist/SQONView/utils';

export const filteredSqon = (sqon, showExpanded = false) => {
  return showExpanded ? sqon : removeSQON('expanded', sqon);
};
