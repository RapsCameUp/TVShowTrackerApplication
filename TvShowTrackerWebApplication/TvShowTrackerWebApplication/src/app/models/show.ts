import { Episode } from "./episode";

export interface Show {
    id?: string;
    _Id?: string;
    title: string;
    episodes: Episode[];
}