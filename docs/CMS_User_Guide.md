# HCMI Content Management System
The HCMI Content Management System (CMS) consists of the database of models found in the [HCMI Searchable Catalog](), as well as all content management controls. This user guide describes the capabilities of the CMS system and the requirements for model model management.


## Logging In 
The [HCMI CMS]() is accessible only by designated Content Administrators. In order for a Content Administrator to be able to access the system, two requirements must be met:
- They must have a valid NIH AD accounts.
- They must be registered as a Content Administrator in the CMS.

NIH AD accounts are assigned and managed by NIH. New Content Administrators can be added in the CMS [User Management](#user-management) section. 

To login, visit the [HCMI CMS site]() and enter you NIH credentials.  If you are authenticated and registered a Content Administrator you should be redirected to the [Model Management](#model-management) page and you can begin editing content. 


## [Model Management](#model-management)
### Bulk Upload
Content Administrators can upload multiple models at a time using a Google sheet. To complete an upload of multiple models:
1. Ensure the Content Adminstators Google [account is linked](#link-google-account).
2. Prepare a Google sheet, according to [formatting instructions](#formatting-upload-sheet) of models to upload. 
2. Click "Bulk Upload" on the model management page.  This will launch a modal asking for the link to the Google sheet where the data is stored.  
2. Copy the webpage browser link from the correct Google sheet and paste it into the modal.
3. Select your overwrite options. There are 2 options:
	- **No:** By selecting No, only models that are _new additions_ will be added to the database. 
	- **Yes:**  By selecting yes, all models in the the sheet will be _added or updated_.  The data within the sheet will be considered the most up to date, and will overwrite any values on models that already exist in the database, excluding images and variants. 
4. Click "Upload".
5. Once the upload is completed, models that have passed validation will be added to the database and a success message with appear on the interface. If a model has an error in formatting in the sheet, a message with the errors will appear.


#### [Formatting An Upload Sheet](formatting-upload-sheet)

Bulk uploads are performed by submmiting a correctly formatted Google sheet to the bulk uploader.  During the upload process, the CMS bulk upload will read in the model data listed in rows and validate the submitted values for each field against the [data dictionary](#data-dictionary).
For any sheet submitted to the bulk uploader:
- It must contain the correct headers.
- Each row must consist of a single model only.
- Values in each field should match the [data dictionary](#data-dictionary).

A template sheet prepared for bulk uploadaing can be found here: [Bulk Upload Template Sheet](https://docs.google.com/spreadsheets/d/1zQ8C0WeFxYlE_1Y591NqqolXud_g1ubrDLMF8iQvV-0/edit#gid=0)

### Bulk Publish, Unpublish, and Delete
Publish
Unpublish
Delete
### Add/Edit a Model
#### Adding Images
In order to add images to a model, navigate the the CMS Edit Model Page and click on the "Images" tab on the right.  You can drag-and-drop image 
#### Adding Variants

## [User Management](#user-management)
### Adding Content Administrators
### Deleting Content Administrators
### [Linking your Google Account](#link-google-account)
If a Content Administrator wishes to complete an upload of bulk data
In order to link your Google

## [Data Dictionary](#data-dictionary)
| Field  |  Required or Publishing | Premissible Values  |   |   |
|---|---|---|---|---|
|Name|   |   |   |   |
|Type|   |   |   |
|   |   |   |   |   |

