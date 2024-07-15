using TvShowTracker.Models.DbContext;
using TvShowTracker.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using TvShowTracker.Services;

namespace TvShowTracker.Repository
{
    public class UserRepository : IUserRepository
    {

        private readonly TvShowContext _context;

        public UserRepository(TvShowContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.Find(_ => true).ToListAsync();
        }
        public async Task<User> GetByIdAsync(ObjectId id)
        {
            return await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.InsertOneAsync(user);
        }

        public async Task UpdateAsync(User user)
        {
            await _context.Users.ReplaceOneAsync(u => u.Id == user.Id, user);
        }

        public async Task DeleteAsync(ObjectId id)
        {
            await _context.Users.DeleteOneAsync(u => u.Id == id);
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _context.Users.Find(user => user.Username == username).FirstOrDefaultAsync();
        }
    }

}
