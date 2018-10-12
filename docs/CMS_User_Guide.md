# HCMI Content Management System User Guide
The HCMI Content Management System (CMS) consists of the database of models found in the [HCMI Searchable Catalog](), as well as all content management controls. This user guide describes the capabilities of the CMS system and the requirements for model management.

**User Management FAQ:**
- [How to log in to the CMS?](#how-to-log)
- [How to link your Google account?](#link-google-account)
- [How to add additional Content Administrators?](#how-to-add-users)

**Model Management FAQ:**
- [How to add or edit a model?](#how-to-format)
- [How to bulk upload models via Google sheet?](#how-to-upload)
- [How to format a bulk upload Google sheet?](#how-to-format)
- [How to add images to a model?](#how-to-add-images)
- [How to publish a model to the Searchable Catalog?](#how-to-publish)



## Logging In 
The [HCMI CMS]() is accessible only by designated Content Administrators. In order for a Content Administrator to be able to access the system, two requirements must be met:
- They must have a valid NIH Active Directory (AD) account.
- They must be registered as a Content Administrator in the CMS by another Content Administrator.

NIH AD accounts are assigned and managed by NIH. New Content Administrators can be added in the CMS [User Management](#user-management) page by another Content Administrator. 
### [How to Login](#how-to-login)

**To login to the CMS:**
1. Visit the [HCMI CMS page]()  
2. Enter your NIH credentials.  If you are authenticated and registered as a Content Administrator you should be redirected to the [Model Management](#model-management) page and you can begin editing and adding content. 
3. If you are not authenticated, you will be taken to the following error page. Please check that your credentials are correct or that you are registered a Content Administrator.

{{{IMAGE HERE}}}}


## [Model Management](#model-management)

Content Administrators can add models, images and variants via the CMS.  To enter models into the database, there are two different ways: as a [bulk upload](how-to-upload) of multiple models or [individually](#how-to-add-edit-models).  Images and variants can be added on a per model basis through the [image uploader](#how-to-add-images) and [variant uploader](#how-to-add-variants).

### [Add/Edit a Model](#how-to-add-edit-models)
Content Administrators can  edit individual models from the web interface.  

**To add a model:**
1. Navigate to the [Model Management]() page.
2. Click the "Add a Model" button above the model management table on the right side. You will be navigated to a new model entry form. 
3. Enter the name of the model in the correct format in the first form box.  
4. Fill in the rest of the form fields. 

	> Note: Each of the form fields has a set of validations.  Validation messages on the field appear if incorrect data is entered.  Please refer to the [data dictionary](#data-dictionary) for individual field validation rules.
4. Click the "Save" button in the top right corner when you have completed filling in the form fields.  The model will be saved to the database, but not available on the public searchable catalog. 

**To edit a model:**
1. Navigate to the [Model Management]() page.
2. Find the correct model in the model management table and click the "Edit" button in the far right. column.
3. Adjust form fields on the model edit page as desired. 
4. After you have completed editing the model, there are two options:
	- **Save:** By selecting Save, the changes will be saved to the database but will not be visible on the searchable catalog if the model is already published. 
	- **Publish:**  By selecting Publish, the changes will will be saved to the database and the  immediately available on the public searchable catalog
 
#### [Add Images to a Model](#how-to-add-images)
Images are added to a model by using the image uploader on the Edit Model page. 

**To add images to a model:**
1. Find the correct model in the [model management table]() and click the "Edit" button in the far right column.
2. Within the Edit Model Page for this model, click on the "Images" tab on to the left of the model details form.
3. If there are no images for the model yet, you can drag and drop images on the box on the screen or click the browse button to search your computer for the files. Once a file is uploaded, it will autosave to the database. 

	> Note: Images will not be visible on the publish portal until the model is published. 
5. If you are finished editing this model, publish it to the public catalog by clicking the "Publish" button above the form on the right.

#### Deleting Images
**To delete images from a model:**
1. Find the correct model in the [model management table]() and click the "Edit" button in the far right column.
2. Within the Edit Model Page for this model, click on the "Images" tab on the left of the model details form.
3. 

#### [Adding Variants](#how-to-add-variants)
**To add variants:**
1. Find the correct model in the [model management table]() and click the "Edit" button in the far right column.
2. Within the Edit Model Page for this model, click on the "Variants" tab on the left of the model details form.
 
### [Bulk Upload](#how-to-upload)
Content Administrators can upload multiple models at a time using a Google sheet and the CMS bulk uploader. This allows Content Administrators to add or update large amounts of data in a single action.

**To complete a bulk upload of multiple models:**
1. Ensure the Content Administrators [Google account is linked](#link-google-account).
2. Prepare a Google sheet of models to upload (see [How to bulk upload models via Google sheet?](how-to-upload))
3. Navigate to the  [Model Management]() page.
4. Click "Bulk Upload" button above the model management table on the right side.  This will launch a modal asking for the link to the Google sheet where the data is stored.  
5. Copy the Google sheet URL from your browser and paste it into the Google Sheets URL text box in the modal.
6. Select your overwrite preference. There are 2 options:
	- **No:** By selecting No, only models that are _new additions to the database_ will be added to the database. Any updated fields on existing models will be ignored. 
	- **Yes:**  By selecting yes, all models in the the sheet will be _added or updated_.  The data within the sheet will be considered the most up-to-date, and will overwrite any values on models that already exist in the database, excluding images and variants. 
7. Click the "Upload" button.
8. Once the upload is completed, models that have passed validation will be added to the database and a success message with appear on the interface. If any model has a formatting error in your Google sheet, a red message will appear listing the errors.

### [How to format an upload sheet](#how-to-format)

Bulk uploads are performed by submitting a correctly formatted Google sheet to the bulk uploader.  During the upload process, the CMS bulk uploader will read in the model data listed in the rows and validate the submitted values for each field against the [data dictionary](#data-dictionary).
For any sheet submitted to the bulk uploader:
- It must contain the correct headers.
- Each row must consist of a single model.
- Values in each field should match the the correct values in [data dictionary](#data-dictionary).

A template sheet prepared for bulk uploading can be found here: [Bulk Upload Template Sheet](https://docs.google.com/spreadsheets/d/1zQ8C0WeFxYlE_1Y591NqqolXud_g1ubrDLMF8iQvV-0/edit#gid=0)

To use this template in Google sheets click File > Make a Copy.  From your copied sheet, you can add model data to each row.  For fields that do not have validation rules in the Google sheet itself, please refer to the [data dictionary](#data-dictionary) for individual field validation rules. 
### [Publishing Models](#how-to-publish)


### Bulk Publish, Unpublish, and Delete
**To bulk publish, unpublish, or delete models:**
1. Navigate to the [Model Management]() page.
2. Select the models of your choice using the checkboxes in the table in the far left column.
3. At the top of the table, use the Bulk Actions dropdown,to select your action. Then click the Apply button beside the dropdown.
 	- **Publish:** By selecting Publish, the selected models that pass validation will be saved and made _immediately available_ on the public searchable catalog. The selected models that don't pass validation will not be available on the public searchable catalog and you will see a red message above the table listing the validation errors.
	- **Unpublish:**  By selecting unpublish, all models will be _immediately removed_ from the public searchable catalog. 
	- **Delete:**  By selecting delete, all selected models will be _permanently deleted_. Deletion is NOT a reversible action. 



## [User Management](#user-management)
### [Add Content Administrators](#how-to-add-users)

**To add a Content Administrator:**
1. From the [User Management]() page, click "Add User"
2. Enter the Content Administrators name the email address that is associated to their NIH AD account.
3. Select the "Active" radio button to make this user an active content administrator.
4. Click the "Save" button. The user will  be added as a Content Administrator and can try [logging in](#how-to-login) to the system. 

### Inactivate/Delete Content Administrators
**To inactivate a Content Administrator:**
1. From the [User Management]() page, click "Edit" button on the correct user row.
2. Select the "Inactive" radio button from the user status option. 
3. Click the "Save" button.

**To delete a Content Administrator:**
1. From the [User Management]() page, click the "Delete" button on the correct user row. 
2. Click the "Delete" button in the confirmation modal that is presented.

### [Link your Google Account](#link-google-account)
In order to link your Google account:
1.

## [Data Dictionary](#data-dictionary)
| Field  |  Required or Publishing | Description | Permissible Values   |   |
|---|---|---|---|---|
|Name|   |   |   |   |
|Type|   |   |   |
|   |   |   |   |   |

