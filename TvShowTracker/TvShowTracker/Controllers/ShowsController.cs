using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using TvShowTracker.Models;
using TvShowTracker.Repository;
using static System.Net.Mime.MediaTypeNames;

namespace TvShowTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ShowsController : ControllerBase
    {
        private readonly IShowRepository _showRepository;
        private readonly IUserRepository _userRepository;
        private readonly IWebHostEnvironment _environment;

        public ShowsController(IShowRepository showRepository, IUserRepository userRepository, IWebHostEnvironment environment)
        {
            _showRepository = showRepository;
            _userRepository = userRepository;
            _environment = environment;
        }

        /// <summary>
        /// Get all shows
        /// </summary>
        /// <returns>List of shows</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllShows()
        {
            try
            {
                var shows = await _showRepository.GetAllAsync();
                return Ok(shows);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get show by ID
        /// </summary>
        /// <param name="id">Show ID</param>
        /// <returns>Show</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetShowById(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                return BadRequest("Invalid show ID");
            }

            var show = await _showRepository.GetByIdAsync(objectId);
            if (show == null)
            {
                return NotFound();
            }
            return Ok(show);
        }

        /// <summary>
        /// Create a new show
        /// </summary>
        /// <param name="show">Show model</param>
        /// <param name="imageFile">Image file</param>
        /// <returns>Created show</returns>
        [HttpPost]
        public async Task<IActionResult> CreateShow([FromForm] Show show, [FromForm] IFormFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                // storage of show file image into the local folder
                if (imageFile != null)
                {
                    var uploads = Path.Combine(_environment.ContentRootPath, "uploads");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                    var filePath = Path.Combine(uploads, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }

                    show.ImagePath = uniqueFileName;
                }

                show.Id = ObjectId.GenerateNewId();

                // Assign new IDs and ShowId to episodes
                show.Episodes.ForEach(e =>
                {
                    e.Id = ObjectId.GenerateNewId();
                    e.ShowId = show.Id;
                });

                await _showRepository.AddAsync(show);



                return CreatedAtAction(nameof(GetShowById), new { id = show.Id.ToString() }, show);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing show
        /// </summary>
        /// <param name="id">Show ID</param>
        /// <param name="show">Updated show model</param>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateShow(string id, [FromBody] Show show)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                return BadRequest("Invalid show ID");
            }

            if (show.Id != objectId)
            {
                return BadRequest("Show ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingShow = await _showRepository.GetByIdAsync(objectId);
            if (existingShow == null)
            {
                return NotFound();
            }

            try
            {
                await _showRepository.UpdateAsync(show);
                return Ok(new { Message = "Show updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Delete a show
        /// </summary>
        /// <param name="id">Show ID</param>
        /// <returns>No content</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShow(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                return BadRequest("Invalid show ID format");
            }

            var show = await _showRepository.GetByIdAsync(objectId);
            if (show == null)
            {
                return NotFound();
            }

            try
            {
                await _showRepository.DeleteAsync(objectId);
                return Ok(new { Message = "Show deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        /// <summary>
        /// Mark an episode as watched
        /// </summary>
        /// <param name="model">Mark episode watched model</param>
        /// <returns>No content</returns>
        [HttpPost("markEpisodeAsWatched")]
        public async Task<IActionResult> MarkEpisodeAsWatched([FromBody] MarkEpisodeWatchedModel model)
        {
            var user = await _userRepository.GetByUsernameAsync(model.userName);

            if (user == null)
            {
                return BadRequest("Invalid username");
            }

            var userShow = user.UserShows.FirstOrDefault(us => us.ShowId == model.showId);
            if (userShow == null)
            {
                userShow = new UserShow { ShowId = model.showId, UserId = user.Id };
                user.UserShows.Add(userShow);
            }

            var watchedEpisode = userShow.WatchedEpisodes.FirstOrDefault(we => we.EpisodeId == model.episodeId);
            if (watchedEpisode == null)
            {
                watchedEpisode = new WatchedEpisode { EpisodeId = model.episodeId };
                userShow.WatchedEpisodes.Add(watchedEpisode);
            }

            await _userRepository.UpdateAsync(user);

            return Ok(new { Message = "Episode marked as watched" });
        }


        /// <summary>
        /// Get next episode to watch for a user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="showId">Show ID</param>
        /// <returns>Next episode</returns>
        [HttpGet("{userId}/next")]
        public async Task<IActionResult> GetNextEpisodeToWatch(string userId, string showId)
        {
            if (!ObjectId.TryParse(userId, out var userObjectId) || !ObjectId.TryParse(showId, out var showObjectId))
            {
                return BadRequest("Invalid user or show ID");
            }

            var user = await _userRepository.GetByIdAsync(userObjectId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var userShow = user.UserShows.FirstOrDefault(us => us.ShowId == showObjectId);
            if (userShow == null)
            {
                return NotFound("Show not found in user's list");
            }

            var show = await _showRepository.GetByIdAsync(showObjectId);
            if (show == null)
            {
                return NotFound("Show not found");
            }

            var watchedEpisodes = userShow.WatchedEpisodes.Select(we => we.EpisodeId).ToHashSet();
            var nextEpisode = show.Episodes.FirstOrDefault(e => !watchedEpisodes.Contains(e.Id));

            if (nextEpisode == null)
            {
                return NotFound("No more episodes to watch");
            }

            return Ok(nextEpisode);
        }
    }
}
