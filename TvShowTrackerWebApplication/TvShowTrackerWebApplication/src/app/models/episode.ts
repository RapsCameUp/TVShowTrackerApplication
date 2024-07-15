export interface Episode {
    id?: string;
    ShowId?: string;
    _ShowId?: string;
    _Id?: string;
    title: string;
    season: number;
    episodeNumber: number;
    isWatched?: boolean;
}