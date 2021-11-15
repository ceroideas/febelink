/**
 * Description [Interface to define KYC]
 *
 * @author abdias
 * @version 0.0.1
 *
 * @interface
 */
 export interface AliceKYC {
    created_at?: string;
    documents?: AliceKYC_documents[];
    events?: any;
    id?: string;
    other_trusted_documents?: any;
    selfies?: any;
    summary?: AliceKYC_summary;
    user_id?: string;
    version?: string;
}


/**
 * Every Document Uploaded to Alice OnBoarding and it's detail
 */
export interface AliceKYC_documents {
    id?: string;
    meta?: AliceKYC_doc_meta;
    sides?: {
        back?: AliceKYC_doc_side;
        front?: AliceKYC_doc_side
    };
}

/**
 * Document Meta Info
 */
export interface AliceKYC_doc_meta {
    completed?: boolean;
    issuing_country?: string;
    type?: string;
    voided?: boolean;
    sides?: any;
}

/**
 * Info of each side of the Document (front and back)
 */
export interface AliceKYC_doc_side {
    fields?: AliceKYC_k_v_s[];
    media?: {
        cropped_document: AliceKYC_doc_media,
        cropped_thumbnail: AliceKYC_doc_media,
        document: AliceKYC_doc_media
    };
    meta?: any;
    side?: string;
}

/**
 * Images of document
 */
export interface AliceKYC_doc_media {
    extension?: string;
    href?: string;
    objects?: any;
}



/**
 * Summary result on finished KYC process
 */
export interface AliceKYC_summary {
    created_at?: string;
    devices?: AliceKYC_devices[];
    external_user_data?: AliceKYC_external_user_data;
    user_data?: AliceKYC_k_v_s[];
}

/**
 * Device with which the action was performed
 */
export interface AliceKYC_devices {
    agent?: string;
    agent_version?: string;
    ip?: string;
    model?: string;
    platform?: string;
    platform_version?: string;
}

/**
 * Values sent to the API to create user token
 */
export interface AliceKYC_external_user_data {
    email?: string;
    first_name?: string;
    last_name?: string;
}

/**
 * Key | Value | Score
 */
export interface AliceKYC_k_v_s {
    name?: string;
    score?: number;
    value?: string;
}