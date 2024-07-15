using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace TvShowTracker.Models
{
    public class WatchedEpisode
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [Required]
        public ObjectId? EpisodeId { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateWatched { get; set; } = DateTime.Now;
    }
}
