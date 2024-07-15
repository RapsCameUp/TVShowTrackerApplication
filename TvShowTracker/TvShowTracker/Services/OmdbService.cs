using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using TvShowTracker.Models.IMDB;

namespace TvShowTracker.Services
{
    public class OmdbService : ImdbShowService
    {
        private readonly HttpClient _httpClient;
        private readonly OmdbApiSettings _settings;

        public OmdbService(HttpClient httpClient, IOptions<OmdbApiSettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }

        // Retrieves details of a specific show asynchronously from OMDb API.
        public async Task<ShowDetails> GetShowDetailsAsync(string title)
        {
            var response = await _httpClient.GetAsync($"{_settings.BaseUrl}?t={title}&apikey={_settings.ApiKey}&type=series");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<ShowDetails>(content);
        }

        // Retrieves details of episodes for a specific show and season asynchronously from OMDb API.
        public async Task<EpisodeDetails> GetEpisodesAsync(string title, int season)
        {
            var response = await _httpClient.GetAsync($"{_settings.BaseUrl}?t={title}&Season={season}&apikey={_settings.ApiKey}");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<EpisodeDetails>(content);
        }

        // Searches for shows based on a search term asynchronously using OMDb API.
        public async Task<IEnumerable<SearchResult>> SearchShowsAsync(string searchTerm)
        {
            var response = await _httpClient.GetAsync($"{_settings.BaseUrl}?s={searchTerm}&apikey={_settings.ApiKey}&type=series");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var results = JsonConvert.DeserializeObject<SearchResults>(content);
            return results?.Search ?? Enumerable.Empty<SearchResult>();
        }
    }
}
