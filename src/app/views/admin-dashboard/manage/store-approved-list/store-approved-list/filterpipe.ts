import { Pipe, PipeTransform } from "@angular/core";
import {ApprovedStores} from 'src/app/_models/approvedstores';​
​
@Pipe({
    name:'search'
})
export class SearchFilterPipe implements PipeTransform{
    transform(ApprovedStores: ApprovedStores[],searchTerm:string): ApprovedStores[]
    {
        if(!ApprovedStores || !searchTerm)
        {
            return ApprovedStores;
        }
​
        return ApprovedStores.filter(stores=>
            
            stores.store_name.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1);
​
    }
​
}