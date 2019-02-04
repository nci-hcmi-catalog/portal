# HCMI Searchable Catalog Data Dictionary 

The HCMI Searchable Catalog has a light-weight dictionary that identifies the properties and accepted types or values for required, preferred, and optional data elements.  Administrative fields that the catalog uses that are not relevent to user use are not included in this data dictionary. 

# Data Dictionary

## models Node


| Field Name | Type | Definition |
|-----------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| age_at_diagnosis | Number | Age that the patient was diagnosed. |
| age_at_sample_acquisition | Number | Age that the sample used to genereate the model was acquired.  |
| chemotherapeutic_drugs | Boolean | Specifies if the patient model was treated successfully with chemotherapeutic drugs.  If yes, a list of responding therapies may be available.  |
| clinical_stage_grouping | String | For cancers that are staged, specifies the AJCC or other stage groupings (e.g. IIB, IIIA, etc.) |
| clinical_tumor_diagnosis | String | Clinical diagnosis of parent tumor |
| date_of_availability | Date | Date the model will be available for purchase from the ATCC. |
| disease_status | String | Disease state of the patient at the time the model was unlinked. |
| gender | String | Text designations that identify gender. |
| growth_rate | Number | The amount of time in culture that the model takes to arrive at the correct volume to split according to the split_ratio.  |
| histological_type | String | Histological Type |
| licensing_required | Boolean | Specified if the model has a specific licensing agreement that must be followed.  If yes, the appropriate licensing policy can be found on the ATCC website. If no, the no licensing requierments apply to this model.   |
| molecular_characterizations | String | Data types of molecular characterizations that have been completed and are available as a resource.  |
| name | String | Unique identifier of the model.  Model names are formatted as [HCM]-[Model Developer]-[ICD10 code of diagnosis]. |
| neoadjuvant_therapy | Boolean | Specifies if the patient received any treatment given as a first step to shrink a tumor before the main treatment. |
| primary_site | String | Organ of the origin of cancer in the patient the model was derived from.  |
| race | String | An arbitrary classification of a taxonomic group that is a division of a species. It usually arises as a consequence of geographical isolation within a species and is characterized by shared heredity, physical attributes and behavior, and in the case of humans, by common history, nationality, or geographic distribution. |
| source_model_url | String | URL referencing the location of the model in external data repository.  |
| source_sequence_url | String | URL referencing the location of the models available sequencing data in external data repository. |
| split_ratio | String | The ratio that the cultured cells should be split during cell propogation.  |
| therapy | String | List of treatment modalities that the patient received.  |
| tnm_stage | String | Pathologic Tumor Node Metastasis (TNM) Stage. The T refers to the size and extent of the main tumor. The N refers to the the number of nearby lymph nodes that have cancer.The M refers to whether the cancer has metastasized.  |
| tumor_histological_grade | String | Histological grade is assigned to a tumor to identify the type of tumor and help determine patient prognosis.  For cancers that are assigned grade, specifies the cancer specific grade.  |
| type | String | Specifies the culture suspension type of the model.   |
| updatedAt | Date | Date the model was last updated by an HCMI content administrator.  |
| vital_status | String | Vital status of the patient at the time the model was unlinked. |


## variants Node
| Field Name | Type | Definition |
|------------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| assessment_type | String | For variants that are dependent on a specific assay type, specifies what method of variant assessment was used.  |
| expression_level | String | For variants that are dependent on a specific assay type, specifies what level of expression the variant displayed in the model, dependent on the assessment_type.  |
| genes | String | Gene that the variant is associated to. |
| name | String | Name of the variant. |
| type | String | Specifies the type of variant (snv, translocation, etc). |