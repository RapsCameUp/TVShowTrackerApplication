using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Services;

namespace TvShowTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IMDBController : ControllerBase
    {
        private readonly ImdbShowService _showService;

        public IMDBController(ImdbShowService showService)
        {
            _showService = showService;
        }

        [HttpGet("{title}")]
        public async Task<IActionResult> GetShowDetails(string title)
        {
            var details = await _showService.GetShowDetailsAsync(title);
            if (details == null)
                return NotFound();

            return Ok(details);
        }

        [HttpGet("{title}/episodes/{season}")]
        public async Task<IActionResult> GetEpisodes(string title, int season)
        {
            var episodes = await _showService.GetEpisodesAsync(title, season);
            if (episodes == null)
                return NotFound();
            return Ok(episodes);
        }

        [HttpGet("search/{searchTerm}")]
        public async Task<IActionResult> SearchShows(string searchTerm)
        {
            var results = await _showService.SearchShowsAsync(searchTerm);
            if (results == null || !results.Any())
                return NotFound();
            return Ok(results);
        }
    }
}
