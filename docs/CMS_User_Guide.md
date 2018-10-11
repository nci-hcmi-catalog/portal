# HCMI Content Management System
The HCMI Content Management System (CMS) consists of the database of models found in the [HCMI Searchable Catalog](), as well as all content management controls. This user guide describes the capabilities of the CMS system and the requirements for model model management
FAQ:
- [How do I log in to the CMS?](how-to-log-in-to-CMS)
- [How do I link my Google account?](#link-google-account)
- [How to bulk upload models via Google sheet?](how-to-upload)
- [How to format an upload sheet?](#how-to-format)
- [How to add images to a model?](#how-to-add-images)
- [How to add additional Content Administrators?](#how-to-add-users)



## Logging In 
The [HCMI CMS]() is accessible only by designated Content Administrators. In order for a Content Administrator to be able to access the system, two requirements must be met:
- They must have a valid NIH Active Directory (AD) account.
- They must be registered as a Content Administrator in the CMS.

NIH AD accounts are assigned and managed by NIH. New Content Administrators can be added in the CMS [User Management](#user-management) page. 
### [Logging in](how-to-login)

To login to the CMS:
1. visit the [HCMI CMS site]()  
2. Enter you NIH credentials.  If you are authenticated and registered a Content Administrator you should be redirected to the [Model Management](#model-management) page and you can begin editing content. 
3. If you are not authenticated, please check that your credentials are correct or that you are registered a Content Administrator.


## [Model Management](#model-management)
Content Administrators can upload multiple models at a time using a Google sheet and the CMS bulk uploader. This allows Content Administrators to add or update large amounts of data in a single action. 

Content Administrators can also edit individual models from the web interface. 


### [Bulk Upload](how-to-upload)
To complete an upload of multiple models:
1. Ensure the Content Adminstators Google [account is linked](#link-google-account).
2. Prepare a Google sheet, according to [formatting instructions](#how-to-formatt) of models to upload. 
3. Naviagate to the  [Model Management]() page.
4. Click "Bulk Upload".  This will launch a modal asking for the link to the Google sheet where the data is stored.  
5. Copy the webpage browser link from the correct Google sheet and paste it into the modal.
6. Select your overwrite options. There are 2 options:
	- **No:** By selecting No, only models that are _new additions_ will be added to the database. 
	- **Yes:**  By selecting yes, all models in the the sheet will be _added or updated_.  The data within the sheet will be considered the most up to date, and will overwrite any values on models that already exist in the database, excluding images and variants. 
7. Click "Upload".
8. Once the upload is completed, models that have passed validation will be added to the database and a success message with appear on the interface. If a model has an error in formatting in the sheet, a message with the errors will appear.


### [How to format an upload sheet](#how-to-format)

Bulk uploads are performed by submitting a correctly formatted Google sheet to the bulk uploader.  During the upload process, the CMS bulk uploader will read in the model data listed in rows and validate the submitted values for each field against the [data dictionary](#data-dictionary).
For any sheet submitted to the bulk uploader:
- It must contain the correct headers.
- Each row must consist of a single model.
- Values in each field should match the [data dictionary](#data-dictionary).

A template sheet prepared for bulk uploadaing can be found here: [Bulk Upload Template Sheet](https://docs.google.com/spreadsheets/d/1zQ8C0WeFxYlE_1Y591NqqolXud_g1ubrDLMF8iQvV-0/edit#gid=0)

To use this template click File > Make a Copy.  From the copied sheet, you can add model data to each row.  For fields that do not have validation rules in the sheet, please refer to the [data dictionary](#data-dictionary) for individual field validation rules. 

### Bulk Publish, Unpublish, and Delete
To bulk publish, unpublish, or delete models:
1. Navigate to the [Model Management]() page.
2. Select the models via checkboxes on the right.
3. At the top of the table, use the dropdown to select your action. Click "Apply"
 	- **Publish:** By selecting Publish, the selected models that pass validation will be indexed and made _immediately available_ on the public searchable catalog. The selected models that don't pass validation will not be available on the public searchable catalog and will have their validation errors highlighted. 
	- **Unpublish:**  By selecting unpublish, all models will be _immediately removed_ from the public searchable catalog. 
	- **Delete:**  By selecting delete, all selected models will be _permanently deleted_. Deletion is NOT a reversible action. 

### Add/Edit a Model
#### [Adding Images](#how-to-add-images)
Image uploads are performed by submitting an image to the image uploader on the Edit Model page. To add images to a model:
1. Navigate the correct CMS Edit Model Page.
2. Click on the "Images" tab on the right.  
3. Drag-and-drop or browse to select image files. Once a file is uploaded, it will autosave to the database. 

	> Note: Images will not be visible on the publish portal until the model is published. 
5. Publish the model.

#### Deleting Images


#### Adding Variants

## [User Management](#user-management)
### [Adding Content Administrators](#how-to-add-users)

To add a Content Administrator:
1. From the [User Management]() page, click "Add User"
2. Enter the name and the NIH AD account associated email.  
3. Select "Active" 
4. Click Save. The user will  be added as a Content Administrator. 

### Inactivating/Deleting Content Administrators
To inactivate a Content Administrator:
1. From the [User Management]() page, click "Edit" on the user row.
2. Select "Inactive" 
3. Click Save.

To delete a Content Administrator:
1. From the [User Management]() page, click "Delete" on the user row. 
2.Click "Delete" to confirm deletion.
3.  Click Save. The 

### [Linking your Google Account](#link-google-account)
In order to link your Google account:
1.

## [Data Dictionary](#data-dictionary)
| Field  |  Required or Publishing | Premissible Values  |   |   |
|---|---|---|---|---|
|Name|   |   |   |   |
|Type|   |   |   |
|   |   |   |   |   |

