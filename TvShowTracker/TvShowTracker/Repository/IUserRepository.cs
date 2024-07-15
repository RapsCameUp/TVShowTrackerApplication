using MongoDB.Bson;
using TvShowTracker.Models;

namespace TvShowTracker.Repository
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(ObjectId id);
        Task<User> GetByUsernameAsync(string username);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(ObjectId id);
    }
}
