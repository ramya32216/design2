export interface Pagination<T> {
    currentPage: number;
    totalCount: number;
    lastPage: number;
    data: Array<T>;
    orders:Array<T>;
    laoding: boolean;
    from: number;
}