using MongoDB.Driver;

namespace TvShowTracker.Models.DbContext
{
    public class TvShowContext
    {
        private readonly IMongoDatabase _database;

        public TvShowContext(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoDb"));
            _database = client.GetDatabase("TvShowTrackerDb");
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<Show> Shows => _database.GetCollection<Show>("Shows");
        public IMongoCollection<Episode> Episodes => _database.GetCollection<Episode>("Episodes");
    }
}
