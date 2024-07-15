using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TvShowTracker.Models
{
    public class Show
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title must not exceed 100 characters.")]
        public string Title { get; set; }

        public string? ImagePath { get; set; }

        public List<Episode> Episodes { get; set; } = new List<Episode>();
    }
}
