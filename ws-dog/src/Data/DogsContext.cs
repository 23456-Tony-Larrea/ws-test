using Microsoft.EntityFrameworkCore;
using ws_dog.src.Models;

namespace ws_dog.src.Data
{
    public class DogsContext : DbContext
    {
        public DogsContext(DbContextOptions<DogsContext> options) : base(options) { }
        public DbSet<Dogs> Dogs { get; set; }

    }
}
