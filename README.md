# HCMI Searchable Catalog

The [HCMI Searchable Catalog ](https://hcmi-searchable-catalog.nci.nih.gov/) allows users to browse and identify potential next-generation cancer models for use in research. Links to available associated molecular characterization and clinical data at the National Cancer Institute’s (NCI) Genomic Data Commons (GDC), the European Genomephenome Archive (EGA), and the 3rd party HCMI Model Distributor will be available on each model page as the information is processed and validated.

This is a mono-repo containing the [HCMI Portal UI](ui), [CMS server](cms), and [Arranger Search API server](api) components.

## Development

To work on this project, running the UI, CMS, and API on a local device, make sure your device has the dependencies listed below and then follow the steps in the [Configuration](#Configuration), [Migrations](#Migrations), and [Quickstart](#Quickstart) sections.

### Dependencies

This project runs on **NodeJS 10** . Running this with more recent versions of NodeJS will have issues with some of the npm dependencies used.

- MongoDB - All model and variant data configured in the CMS is stored in MongoDB
- Elasticsearch - The CMS publishes data into ElasticSearch and the API serves the ES data to the UI
- AWS S3 - Used for image storage and serving to the UI. One bucket with public READ access must be setup for this functionality. Alternately, an S3 compatible system such as MinIO can be used since it shares the same API.

  Note: This S3 bucket is only required for model images; the application will run without this, and local development can be done on all non-image functionality without S3 configured.

### Environment Configuration

All 3 of the HCMI applications require a `.env` file with configurable environment variables filled out before running the application. At the root level of each application (`/ui`, `/cms`, `/api`) there is a `.env.schema` file which lists the environment variables used in the application. Copy eacg schema file to the same location renamed `.env` and fill in the relevant details before running the quick start.

#### Configuration for Scripts/PM2

In `/api` and `/cms` there is a template for a `pm2.config.js` file. These files are used for configuration if you want to run the application using PM2. The PM2 config should have the same environment variables used in the .env files for each application.

The CMS config file is also used for the handful of convenience scripts written to help with ElasticSearch setup. If running these scripts, make sure the PM2 Config file has been filled out and make a note of which PM2 environment those variables are provided in (written into `prd` environment in the file committed to the repo).

> WARNING: Be extra cautious not to commit the .env or PM2 config files with your local/environment secret values in it. It is reccomended to add these files to your local .gitignore configuration.

### Migrations

First time setup will require variants being loaded into mongo via a migration in the `cms/variant-migrations` folder. Migrations require the global installation of the migrate-mongo package, `npm i -g migrate-mongo`. for more information visit https://www.npmjs.com/package/migrate-mongo.

To run the required migrations:

```
cd cms/variant-migrations
../../node_modules/.bin/migrate-mongo up -f migrate-mongo-config.js
```

### Quickstart

1. Run dependencies through docker:

```
docker-compose up
```

2. Install node dependcies using yarn, from this project's root directory. This will not work correctly using `npm i`, the three projects are linked and yarn manages the shared dependencies.

```
yarn
```

3. Run database migrations:

```
cd cms/variant-migrations
../../node_modules/.bin/migrate-mongo up -f migrate-mongo-config.js
```

4. Initialize ElasticSearch:
   From the project root directory run the following command. Note that you may need to change the ENV value used to match the environment declared in the `cms/pm2.config.json` file setup.

```
ENV=prd npm run initializeEs
```

5. Run the api:

```
cd api
yarn start
```

6. Run the cms:

```
cd cms
yarn start
```

7. Run the UI:

```
cd ui
yarn start
```

Running the UI will attempt to open the site in your browser.

These applications, when started with yarn, are running in a development mode and will be restarted automatically when you make any changes to their files.

#### Specs

https://wiki.oicr.on.ca/display/HCMI/HCMI+Spec+Guide

#### API Tech

- [@arranger/server](https://github.com/overture-stack/arranger/tree/master/modules/server) (ships with express, socket.io)

#### UI Tech

- [create-react-app](https://github.com/facebook/create-react-app)
- [@arranger/components](https://github.com/overture-stack/arranger/tree/master/modules/components)
- [react-router](https://reacttraining.com/react-router/web/guides/philosophy)
- [emotion css-in-js](https://emotion.sh/docs)
- [styled-system](https://github.com/jxnblk/styled-system)
- [react-component-component](https://www.npmjs.com/package/react-component-component)
