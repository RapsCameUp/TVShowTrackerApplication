import { Episode } from "./episode";

export interface Show {
    id?: string;
    title: string;
    episodes: Episode[];
}