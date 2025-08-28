import { BoxStrategy } from "./box-strategy";

export interface Box<T = any> {
    id: number;
    name: string;
    strategy: BoxStrategy; 
    items: T[];
}