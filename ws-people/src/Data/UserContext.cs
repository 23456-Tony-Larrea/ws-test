using Microsoft.EntityFrameworkCore;
using ws_people.src.models;

namespace ws_people.src.Data
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
    }
}