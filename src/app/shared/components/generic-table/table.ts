import { SafeHtml } from "@angular/platform-browser";
import { ColumnStrategy } from "./column-strategy";

// Tipos fuertes para mejorar mantenibilidad y seguridad de tipos
export interface TableColumn {
    key: string;
    label: string;
    strategy: ColumnStrategy; 
    valueGetter?: (item: any) => any;
}
export type TableRow = { original: any } & Record<string, string | SafeHtml>;