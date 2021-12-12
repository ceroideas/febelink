/**
 * Description [Interface to define KYC]
 *
 * @author abdias
 * @version 0.0.1
 *
 * @interface
 */


export interface KYC_Country {
    name?: string;
    value?: string;
    countryISO?: string;
    docTypes?: KYC_DOCtype[];
}

export enum KYC_DOCtype {
  ID = "idcard",
  PASSPORT = "passport",
  RESIDENCE = "residencepermit",
  DRIVER = "driverlicense",
  HEALTH = "healthinsurancecard"
}

export interface KYC_ERR_Validation {
    deletedDoc?: string;

    document?: KYC_ERR_Doc;
    selfie?: KYC_ERR_Selfie;

    isValid?: boolean;
}

export interface KYC_ERR_Doc {
    birthOK?: boolean;
    dateExpired?: boolean;
    isOver18?: boolean;
    nameOK?: boolean;
    surnameOK?: boolean;
    docNumberOK?: boolean;
    allFieldsOK?: boolean;

    consistentDoc?: boolean;
    expectedDoc?: boolean;

    backHasFields?: boolean;
    frontHasFields?: boolean;
    
    docId?: string;
    isValid?: boolean;
}

export interface KYC_ERR_Selfie {
    hasFaceMatching?: boolean;
    isRealPerson?: boolean;
    isValid?: boolean;

    selfieId?: string;
}