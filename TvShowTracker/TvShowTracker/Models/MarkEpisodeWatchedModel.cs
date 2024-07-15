using MongoDB.Bson;

namespace TvShowTracker.Models
{
    public class MarkEpisodeWatchedModel
    {
        public ObjectId showId { get; set; }
        public ObjectId episodeId { get; set; }
        public string userName { get; set; }
    }

}
