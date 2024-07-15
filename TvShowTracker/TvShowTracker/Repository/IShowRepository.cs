using MongoDB.Bson;
using TvShowTracker.Models;

namespace TvShowTracker.Repository
{
    public interface IShowRepository
    {
        Task<IEnumerable<Show>> GetAllAsync();
        Task<Show> GetByIdAsync(ObjectId id);
        Task AddAsync(Show show);
        Task UpdateAsync(Show show);
        Task DeleteAsync(ObjectId id);
    }
}
