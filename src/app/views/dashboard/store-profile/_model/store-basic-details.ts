import { TimeAvailability } from 'src/app/_modules/time-availability/_model/time-availability';

export class StoreBasicDetails{
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    cuisines: Array<{id: number, name: string}>;
    // description : string;
    googleUrl : string;
    facebookUrl : string;
    storeLogo: string;
    storeImage: string;
    openingHours: Array<TimeAvailability>;
    unclaimed: string;
}