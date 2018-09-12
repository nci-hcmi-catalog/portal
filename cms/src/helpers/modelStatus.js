// Constants
export const modelStatus = {
  unpublished: 'unpublished',
  unpublishedChanges: 'unpublished changes',
  other: 'other',
  published: 'published',
};

export const computeModelStatus = (currentStatus, action) => {
  /*
      *  Matrix
      * -------------------------------------------
      *             |    save     |    publish    |
      * -------------------------------------------
      * unpublished | unpublished |   published   |
      * unpub. chgs | unpub. chgs |   published   |
      * other       | unpublished |   published   |
      * published   | unpub. chgs |   published   |
      * -------------------------------------------
    */

  const statusMatrix = {
    unpublished: {
      save: modelStatus.unpublished,
      publish: modelStatus.published,
    },
    unpublishedChanges: {
      save: modelStatus.unpublishedChanges,
      publish: modelStatus.published,
    },
    other: {
      save: modelStatus.unpublished,
      publish: modelStatus.published,
    },
    published: {
      save: modelStatus.unpublishedChanges,
      publish: modelStatus.published,
    },
  };

  const statusKey = Object.keys(modelStatus).find(key => modelStatus[key] === currentStatus);

  return currentStatus ? statusMatrix[statusKey][action] : modelStatus.unpublished;
};
