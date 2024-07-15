using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TvShowTracker.Models
{
    public class Episode
    {
        public ObjectId Id { get; set; }
        public ObjectId ShowId { get; set; }

        [Required(ErrorMessage = "Episode title is required.")]
        [StringLength(100, ErrorMessage = "Episode title must not exceed 100 characters.")]
        public string Title { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Season number must be greater than 0.")]
        public int Season { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Episode number must be greater than 0.")]
        public int EpisodeNumber { get; set; }

        [BsonIgnore]
        public bool IsWatched { get; set; } = false;
    }
}
