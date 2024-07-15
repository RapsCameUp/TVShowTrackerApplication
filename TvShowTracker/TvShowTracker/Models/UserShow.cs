using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace TvShowTracker.Models
{
    public class UserShow
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [Required]
        public ObjectId? UserId { get; set; }

        [Required]
        public ObjectId? ShowId { get; set; }

        public List<WatchedEpisode>? WatchedEpisodes { get; set; } = new List<WatchedEpisode>();
    }
}
