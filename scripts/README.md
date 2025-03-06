# Scripts

This folder contains scripts used for environment setup and configuration.

```
scripts/
├── initializeEs.js
├── initializeExpanded.js
├── migrateImages.js
├── repairEs.js
├── republish.js
├── updateEs.js
└── utils/
    ├── esUtils.js
    └── republishUtils.js
```

# initializeEs.js

This script will initialize your ElasticSearch environment. It should be run during your initial setup of the project.

> From the project root (`portal/`) or from this directory (`portal/scripts/`), run the following command. Note that you may need to change the ENV value used to match the environment declared in the `cms/pm2.config.json` file setup.

```
ENV=env_prd npm run initializeEs
```

You can specify the following environment variables when running this script:

- **`ENV`: PM2 environment (i.e. `dev`, `prd`, etc.) <sup>_required_</sup>**
- `CMS_CONFIG`: path to your CMS `pm2.config.js` file <sup>_optional_</sup>
- `ES_INDEX`: models index name <sup>_optional_</sup>
- `PROJECT_ID`: Arranger project id <sup>_optional_</sup>
- `ES_HOST`: ElasticSearch host URL <sup>_optional_</sup>

# initializeExpanded.js

This script adds CMS support for Expanded models. It is a one-time script intended to initialize existing models with `expanded = true`, and does not need to be run on new setups as of [Release 1.6.2](https://github.com/nci-hcmi-catalog/portal/releases/tag/1.6.2).

# migrateImages.js

This script migrates existing modela images stored in Mongo to AWS. It is a one-time script intended to migrate existing model images to an S3 bucket, and does not need to be run on new setups as of [Release 1.5.1](https://github.com/nci-hcmi-catalog/portal/releases/tag/1.5.1).

# repairEs.js

This script will re-initialize your ElasticSearch environment. It should be run in the event your existing ES environment gets corrupted during development, or if the type of an existing property needs to be changed in the model index mapping. **This script will _delete_ your existing ES environment and create a new one.** This script automatically runs `republish` as its last step, meaning all _saved_ models will be republished when this is run.

> From the project root (`portal/`) or from this directory (`portal/scripts/`), run the following command. Note that you may need to change the ENV value used to match the environment declared in the `cms/pm2.config.json` file setup.

```
ENV=prd npm run repairEs
```

You can specify the following environment variables when running this script:

- **`ENV`: PM2 environment (i.e. `dev`, `prd`, etc.) <sup>_required_</sup>**
- `CMS_CONFIG`: path to your CMS `pm2.config.js` file <sup>_optional_</sup>
- `ES_INDEX`: models index name <sup>_optional_</sup>
- `PROJECT_ID`: Arranger project id <sup>_optional_</sup>
- `ES_HOST`: ElasticSearch host URL <sup>_optional_</sup>

# republish.js

This script republishes all models to ElasticSearch. It should be run after any schema changes. Note that models will be republished in their **saved state** in the CMS. Any **saved changes** that are not yet published **will be published** after running this script (overwriting the state that is currently published).

> From the project root (`portal/`) or from this directory (`portal/scripts/`), run the following command. Note that you may need to change the ENV value used to match the environment declared in the `cms/pm2.config.json` file setup.

```
ENV=prd npm run republish
```

You can specify the following environment variables when running this script:

- **`ENV`: PM2 environment (i.e. `dev`, `prd`, etc.) <sup>_required_</sup>**
- `CMS_CONFIG`: path to your CMS `pm2.config.js` file <sup>_optional_</sup>
- `ES_INDEX`: models index name <sup>_optional_</sup>
- `PROJECT_ID`: Arranger project id <sup>_optional_</sup>
- `ES_HOST`: ElasticSearch host URL <sup>_optional_</sup>

# updateEs.js

This script updates ElasticSearch indices and refreshes the Arranger project with the updated indices. It should be run after any changes to the Arranger metadata (`elasticsearch/arranger_metadata/*.json`).

> From the project root (`portal/`) or from this directory (`portal/scripts/`), run the following command. Note that you may need to change the ENV value used to match the environment declared in the `cms/pm2.config.json` file setup.

```
ENV=prd npm run updateEs
```

You can specify the following environment variables when running this script:

- **`ENV`: PM2 environment (i.e. `dev`, `prd`, etc.) <sup>_required_</sup>**
- `CMS_CONFIG`: path to your CMS `pm2.config.js` file <sup>_optional_</sup>
- `ES_INDEX`: models index name <sup>_optional_</sup>
- `PROJECT_ID`: Arranger project id <sup>_optional_</sup>
- `ES_HOST`: ElasticSearch host URL <sup>_optional_</sup>
