export const USER = {
    CATEGORY: 'user',
    PERMISSIONS: {
        ALL: 'user',
        CREATE_STAFF: 'create_staff',
        DELETE_STAFF: 'delete_staff',
        UPDATE_STAFF: 'update_staff',
        VIEW_STAFF: 'view_staff',

        CREATE_PARENT: 'create_parent',
        DELETE_PARENT: 'delete_parent',
        UPDATE_PARENT: 'update_parent',
        VIEW_PARENT: 'view_parent',

        CREATE_STUDENT: 'create_student',
        DELETE_STUDENT: 'delete_student',
        UPDATE_STUDENT: 'update_student',
        VIEW_STUDENT: 'view_student'
    }
}

export const ROLE = {
    CATEGORY: 'role',
    PERMISSIONS: {
        ALL: 'role',
        CREATE_ROLE: 'create_role',
        DELETE_ROLE: 'delete_role',
        UPDATE_ROLE: 'update_role',
        VIEW_ROLE: 'view_role',
        ASSIGN_ROLE: 'assign_role',
    }
}

export const TRANSACTION = {
    CATEGORY: 'fee',
    PERMISSIONS: {
        ALL: 'fee',
        LOG_FEE: 'log_fee',
        VIEW_PAYMENT: 'view_payment',
        VIEW_FEE: 'view_fee',
        CREATE_FEE: 'create_fee'
    }
}

export const PROMOTION = {
    CATEGORY: 'promotion',
    PERMISSIONS: {
        ALL: 'promotion'
    }
}

export const COMPLAINS = {
    CATEGORY: 'complain',
    PERMISSIONS: {
        ALL: 'complain',
        VIEW_COMPLAINS: 'view_complains',
        SERVICE_COMPLAINS: 'service_complains'
    }
}

export const RESULT = {
    CATEGORY: 'result',
    PERMISSIONS: {
        ALL: 'result',
        SUBMIT_RESULT: 'submit_result',
        APPROVE_RESULT: 'approve_result',
        SINGLE_DOWNLOAD: 'single_download_result',
        BULK_DOWNLOAD: 'bulk_download_result'
    }
}

export const ATTRIBUTE_ASSESSMENT = {
    CATEGORY: 'attr_assessment',
    PERMISSIONS: {
        ALL: 'attr_assessment',
        ADD_ATTR_ASSESSMENT: 'add_attr_assessment',
        VIEW_ATTR_ASSESSMENT: 'view_attr_assessment',
        EDIT_ATTR_ASSESSMENT: 'edit_attr_assessment'
    }
}

export const CLASS = {
    CATEGORY: 'class_assessment',
    PERMISSIONS: {
        ALL: 'class_assessment',
        CREATE_CLASS: 'create_class',
        DELETE_CLASS: 'delete_class',
        UPDATE_CLASS: 'update_class'
    }
}

export const SUBJECT = {
    CATEGORY: 'subject_assessment',
    PERMISSIONS: {
        ALL: 'subject_assessment',
        CREATE_SUBJECT: 'create_subject',
        UPDATE_SUBJECT: 'update_class',
        DELETE_SUBJECT: 'delete_subject',
        ASSIGN_SUBJECT: 'assign_subject',
    }
}

export const POST = {
    CATEGORY: 'post',
    PERMISSIONS: {
        ALL: 'post',
        CREATE_POST: 'create_post',
        UPDATE_POST: 'update_post',
        DELETE_POST: 'delete_post',
    }
}