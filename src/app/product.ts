export interface Product {
    name: string;
    image: string | boolean;
    barcode: string;
    lst_price: number;
    currency?: string;
}
