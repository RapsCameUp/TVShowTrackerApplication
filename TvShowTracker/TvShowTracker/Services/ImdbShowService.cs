using TvShowTracker.Models.IMDB;

namespace TvShowTracker.Services
{
    public interface ImdbShowService
    {
        Task<ShowDetails> GetShowDetailsAsync(string title);
        Task<EpisodeDetails> GetEpisodesAsync(string title, int season);
        Task<IEnumerable<SearchResult>> SearchShowsAsync(string searchTerm);
    }
}
