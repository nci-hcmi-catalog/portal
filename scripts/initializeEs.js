const esConfig = require('./esConfig');
const run = async () => {
  /** initialize search index */
<<<<<<< HEAD
  await esConfig.createSearchIndex();
  await esConfig.createArrangerProjectList();
  await esConfig.createArrangerProject();
};

run();
=======
  try {
    console.log(`\nCreating search index: ${searchIndex}`);
    await client.indices.create({
      index: searchIndex,
      body: indexSetup,
    });
    console.log('Success! Created index:', searchIndex);
  } catch (e) {
    console.log('Unable to create index:', searchIndex);
    console.log(e);
  }

  try {
    console.log(`\nCreating arranger project list: arranger-projects`);
    await client.indices.create({
      index: 'arranger-projects',
    });
    console.log(`\nAdding project to arranger project list: ${arrangerProject}`);
    await client.index({
      index: 'arranger-projects',
      body: {
        id: arrangerProject,
        active: true,
        timestamp: date,
      },
    });
    console.log('Success! Created arranger-projects and added project:', arrangerProject);
  } catch (e) {
    console.log('Unable to initialize arranger-projects');
    console.log(e);
  }

  const projectIndex = `arranger-projects-${arrangerProject}`;
  try {
    console.log(`\nCreating arranger project metadata: ${arrangerProject}`);
    await client.indices.create({
      index: projectIndex,
    });
    await client.index({
      index: projectIndex,
      body: {
        index: searchIndex,
        name: 'models',
        timestamp: date,
        active: true,
        config: {
          'aggs-state': {
            timestamp: date,
            state: aggsState,
          },
          'columns-state': {
            timestamp: date,
            state: columnsState,
          },
          'matchbox-state': {
            timestamp: date,
            state: matchboxState,
          },
          extended: extended,
        },
      },
    });
    console.log('Success! Created and configured project index:', arrangerProject);
  } catch (e) {
    console.log('Unable to set up project meta data:', projectIndex);
    console.log(e);
  }

  try {
    console.log(`\nCreating index: arranger-sets`);
    await client.indices.create({
      index: 'arranger-sets',
      body: {
        mappings: {
          properties: {
            setId: {
              type: 'keyword',
            },
            sqon: {
              type: 'object',
            },
            ids: {
              type: 'keyword',
            },
            type: {
              type: 'keyword',
            },
            path: {
              type: 'keyword',
            },
            size: {
              type: 'long',
            },
            createdAt: {
              type: 'date',
            },
          },
        },
      },
    });
    console.log('Success! Created arranger-sets');
  } catch (e) {
    console.log('Unable to create:', 'arranger-sets');
    console.log(e);
  }
})();
>>>>>>> release/es-7
