using TvShowTracker.Models.DbContext;
using TvShowTracker.Models;
using MongoDB.Driver;
using MongoDB.Bson;

namespace TvShowTracker.Repository
{
    public class ShowRepository : IShowRepository
    {

        private readonly TvShowContext _context;

        public ShowRepository(TvShowContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Show>> GetAllAsync()
        {
            return await _context.Shows.Find(_ => true).ToListAsync();
        }

        public async Task<Show> GetByIdAsync(ObjectId id)
        {
            return await _context.Shows.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task AddAsync(Show show)
        {
            await _context.Shows.InsertOneAsync(show);
        }

        public async Task UpdateAsync(Show show)
        {
            await _context.Shows.ReplaceOneAsync(s => s.Id == show.Id, show);
        }

        public async Task DeleteAsync(ObjectId id)
        {
            await _context.Shows.DeleteOneAsync(s => s.Id == id);
        }
    }
}
