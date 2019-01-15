# Portal API

The portal API provides access to the data published through the Portal CMS. API provides a small selection of custom endpoints providing specific data access, and also runs [Overture](https://www.overture.bio) [Arranger](https://github.com/overture-stack/arranger) providing a GraphQL endpoint to query model data from ElasticSearch.

## Quick Start

_It is recommended to typically run all the portal services concurrently using the docker compose configuration from the repository's top level._

To configure run the API locally in isolation, follow these steps:

1.  Configuration File

    Copy the `.env.schema` file to a new file called `.env` and provide values for all the variables

1.  Dependencies

    The API will attempt connections with several external systems. If these are not configured or are unavailable then some functionality will fail. The expected dependencies are:

    1.  MongoDB from the CMS
    1.  ElasticSearch with the published model data

## API Documentation

This section details HTTP requests for all endpoints provided by the API service.

When running on the portal, all these endpoints are found within the `/api` path. The URLs given here are relative to this api path.

### Custom Endpoints

#### 1. CMS Data

The `/data` path is provided to provide access to specific content stored in the CMS database.

Currently only stored image data is available through this path.

##### Images

**URL** : `/data/images/:imageId`

**Method** : GET

**Parameters** :
| Name | Type | Value |
| --- | --- | --- |
| imageId | Path | [URL Encoded String] Image ID assigned by the CMS to the uploaded image |

**Response** : Image Data

**Example** : `<img src="https://hcmi-searchable-catalog.nci.nih.gov/api/data/images/5c1910b33361c71c89a48add" />`

#### 2. Data Export

This is a wrapper for Arranger's table export functionality

**URL** : `/export/:projectId/models`

**Method** : POST

**Body** : application/x-www-form-urlencoded - See Parameters chart.

**Parameters** :
| Name | Type | Value |
| --- | --- | --- |
| projectId | Path | [URL Encoded String] Arranger project ID |
| params | Body | [JSON] These are the params that are parsed and sent to arranger to generate the .tsv file of the chart data. This includes many fields (see example below) and specifies the files to include, file type, fields to include etc.|
| httpHeaders | Body | [JSON] Passthrough for Header values that Arranger expects - `Authorization` is commonly provided (with an Ego JWT), though is uneccesary for exports of public data. |
| downloadKey | Body | [UUID] Unique identifier for download session - Included in requests but unused |

**Response** : .tsv file with content as specified in the request body

**curl Example** :

```
curl -X POST https://hcmi-searchable-catalog.nci.nih.gov/api/export/hcmi/models -H 'Authorization: Bearer ENCODED.JWT.DATA -d 'params=%7B%22files%22%3A%5B%7B%22fileName%22%3A%22models-table.tsv%22%2C%22fileType%22%3A%22tsv%22%2C%22index%22%3A%22models%22%2C%22columns%22%3A%5B%7B%22field%22%3A%22name%22%2C%22accessor%22%3A%22name%22%2C%22show%22%3Atrue%2C%22type%22%3A%22entity%22%2C%22sortable%22%3Atrue%2C%22canChangeShow%22%3Atrue%2C%22query%22%3Anull%2C%22jsonPath%22%3Anull%2C%22Header%22%3A%22Name%22%2C%22extendedType%22%3A%22keyword%22%2C%22extendedDisplayValues%22%3A%7B%7D%2C%22hasCustomType%22%3Atrue%2C%22minWidth%22%3A140%7D%2C%7B%22field%22%3A%22primary_site%22%2C%22accessor%22%3A%22primary_site%22%2C%22show%22%3Atrue%2C%22type%22%3A%22string%22%2C%22sortable%22%3Atrue%2C%22canChangeShow%22%3Atrue%2C%22query%22%3Anull%2C%22jsonPath%22%3Anull%2C%22Header%22%3A%22Primary+Site%22%2C%22extendedType%22%3A%22keyword%22%2C%22extendedDisplayValues%22%3A%7B%7D%2C%22hasCustomType%22%3Afalse%7D%2C%7B%22field%22%3A%22clinical_diagnosis.clinical_tumor_diagnosis%22%2C%22accessor%22%3A%22clinical_diagnosis.clinical_tumor_diagnosis%22%2C%22show%22%3Atrue%2C%22type%22%3A%22string%22%2C%22sortable%22%3Atrue%2C%22canChangeShow%22%3Atrue%2C%22query%22%3Anull%2C%22jsonPath%22%3Anull%2C%22Header%22%3A%22Clinical+Tumor+Diagnosis%22%2C%22extendedType%22%3A%22keyword%22%2C%22extendedDisplayValues%22%3A%7B%7D%2C%22hasCustomType%22%3Afalse%7D%2C%7B%22field%22%3A%22gender%22%2C%22accessor%22%3A%22gender%22%2C%22show%22%3Atrue%2C%22type%22%3A%22string%22%2C%22sortable%22%3Atrue%2C%22canChangeShow%22%3Atrue%2C%22query%22%3Anull%2C%22jsonPath%22%3Anull%2C%22Header%22%3A%22Gender%22%2C%22extendedType%22%3A%22keyword%22%2C%22extendedDisplayValues%22%3A%7B%7D%2C%22hasCustomType%22%3Afalse%7D%2C%7B%22field%22%3A%22race%22%2C%22accessor%22%3A%22race%22%2C%22show%22%3Atrue%2C%22type%22%3A%22string%22%2C%22sortable%22%3Atrue%2C%22canChangeShow%22%3Atrue%2C%22query%22%3Anull%2C%22jsonPath%22%3Anull%2C%22Header%22%3A%22Race%22%2C%22extendedType%22%3A%22keyword%22%2C%22extendedDisplayValues%22%3A%7B%7D%2C%22hasCustomType%22%3Afalse%7D%2C%7B%22field%22%3A%22age_at_sample_acquisition%22%2C%22accessor%22%3A%22age_at_sample_acquisition%22%2C%22show%22%3Atrue%2C%22type%22%3A%22number%22%2C%22sortable%22%3Atrue%2C%22canChangeShow%22%3Atrue%2C%22query%22%3Anull%2C%22jsonPath%22%3Anull%2C%22Header%22%3A%22Age+At+Acquisition+%28Years%29%22%2C%22extendedType%22%3A%22long%22%2C%22extendedDisplayValues%22%3A%7B%7D%2C%22hasCustomType%22%3Afalse%7D%2C%7B%22field%22%3A%22age_at_diagnosis%22%2C%22accessor%22%3A%22age_at_diagnosis%22%2C%22show%22%3Atrue%2C%22type%22%3A%22number%22%2C%22sortable%22%3Atrue%2C%22canChangeShow%22%3Atrue%2C%22query%22%3Anull%2C%22jsonPath%22%3Anull%2C%22Header%22%3A%22Age+At+Diagnosis+%28Years%29%22%2C%22extendedType%22%3A%22long%22%2C%22extendedDisplayValues%22%3A%7B%7D%2C%22hasCustomType%22%3Afalse%7D%5D%7D%5D%7D&httpHeaders=%7B%7D&downloadKey=dc9e3c25-130c-43ab-a662-fe248add0f4c'
```

**Unencoded Example Request Body** :

```
params: {"files":[{"fileName":"models-table.tsv","fileType":"tsv","index":"models","columns":[{"field":"name","accessor":"name","show":true,"type":"entity","sortable":true,"canChangeShow":true,"query":null,"jsonPath":null,"Header":"Name","extendedType":"keyword","extendedDisplayValues":{},"hasCustomType":true,"minWidth":140},{"field":"primary_site","accessor":"primary_site","show":true,"type":"string","sortable":true,"canChangeShow":true,"query":null,"jsonPath":null,"Header":"Primary Site","extendedType":"keyword","extendedDisplayValues":{},"hasCustomType":false},{"field":"clinical_diagnosis.clinical_tumor_diagnosis","accessor":"clinical_diagnosis.clinical_tumor_diagnosis","show":true,"type":"string","sortable":true,"canChangeShow":true,"query":null,"jsonPath":null,"Header":"Clinical Tumor Diagnosis","extendedType":"keyword","extendedDisplayValues":{},"hasCustomType":false},{"field":"gender","accessor":"gender","show":true,"type":"string","sortable":true,"canChangeShow":true,"query":null,"jsonPath":null,"Header":"Gender","extendedType":"keyword","extendedDisplayValues":{},"hasCustomType":false},{"field":"race","accessor":"race","show":true,"type":"string","sortable":true,"canChangeShow":true,"query":null,"jsonPath":null,"Header":"Race","extendedType":"keyword","extendedDisplayValues":{},"hasCustomType":false},{"field":"age_at_sample_acquisition","accessor":"age_at_sample_acquisition","show":true,"type":"number","sortable":true,"canChangeShow":true,"query":null,"jsonPath":null,"Header":"Age At Acquisition (Years)","extendedType":"long","extendedDisplayValues":{},"hasCustomType":false},{"field":"age_at_diagnosis","accessor":"age_at_diagnosis","show":true,"type":"number","sortable":true,"canChangeShow":true,"query":null,"jsonPath":null,"Header":"Age At Diagnosis (Years)","extendedType":"long","extendedDisplayValues":{},"hasCustomType":false}]}]}

httpHeaders: {}

downloadKey: dc9e3c25-130c-43ab-a662-fe248add0f4c
```

#### 3. Last Updated

**URL** : `/last-updated`

**Method** : GET

**Response** : [JSON]
| Name | Value |
| --- | --- |
| date | [Number] DateTime value for Last Updated Time |

**Example** : `https://hcmi-searchable-catalog.nci.nih.gov/api/last-updated`

### Arranger
