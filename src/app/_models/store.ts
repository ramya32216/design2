export class Store {
    id: number;
    name: string;
    isActive: boolean;
    description: string;
    address: string;
    logo: string;
    cuisineType: string;
    faceBookUrl: string;
    googleUrl: string;
    status: string;
    constructor(id: number, name: string, isActive: boolean, status: string){
        this.id = id;
        this.name = name;
        this.isActive = isActive;
        this.status = status;
    }
}

export function ReadStore(data: any): Store{
    let store = new Store(data.store_id, data.store_name, true,data.status);
    store.description = data.description;
    store.faceBookUrl = data.facebook_url;
    store.googleUrl = data.google_business_url;
    store.address = data.store_address;
    store.logo = data.store_logo;
    store.status = data.status;
    return store;
}