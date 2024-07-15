import { Episode } from "./episode";

export interface UserShow {
    showId: string;
    nextEpisodeToWatch: Episode;
}