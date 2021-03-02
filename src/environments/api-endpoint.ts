export function consolidatedMenuListUrl(storeId) {
    return `store/category/menu/${storeId}`;
}

export function CategoryiesWithItemsForMenu(menuId) {
    return `/api/menus/${menuId}/overview`;
}

// admin urls
export const URL_AdminPendingStores = 'api/stores/pending';
export const URL_AdminApprovedStores = 'api/stores/approved';
export const URL_AdminDeleteStore = 'api/stores/delete-store';
export const URL_AdminAllShellStaff = 'api/stores/staff';
export const URL_Account = 'api/partner/v1/me';
/****
 * 
 *  Version 1 API's
 * 
 ****/
    

// login

export const API_SignUp = 'api/partner/v1/signup';
export const API_ResendVerification = 'api/partner/v1/resend-verification';
export const API_ConfirmVerification = 'api/partner/v1/confirm-verification';
export const API_SignIn = 'api/partner/v1/signin';
export const API_SignOut = 'api/partner/v1/signout';
export const API_ResetPassword = 'api/partner/v1/reset-password';
export const API_ChangePassword = 'api/partner/v1/change-password';
export const API_GetProfileDetails = 'api/partner/v1/me';

// Stores
export const API_CreateStore = '/api/partner/v1/stores';
export function API_UpdateStore(storeId) {
 return  `api/partner/v1/stores/${storeId}`;
}
export function API_UpdateStoreOwnership(storeId) {
    return `api/partner/v1/stores/${storeId}/ownership`;
}
export function API_UpdateStoreBankaccount(storeId) {
    return `api/partner/v1/stores/${storeId}/bankaccount`;
}
export const API_GetStores = 'api/partner/v1/stores';
export function API_GetStoresById(storeId) {
    return `api/partner/v1/stores/${storeId}`;
}
export const API_UploadStoreLogo = 'api/partner/v1/stores/logo';
export const API_UploadStorePicture = 'api/partner/v1/stores/picture';
export const API_UploadStoreCertificate = 'api/partner/v1/stores/certificate';
