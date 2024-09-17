using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ws_dog.src.Data;
using ws_dog.src.DTO;
using ws_dog.src.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ws_dog.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DogsController : ControllerBase
    {
        private readonly DogsContext _context;

        public DogsController(DogsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dogs>>> GetDogs()
        {
            return await _context.Dogs.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Dogs>> Getdog(int id)
        {
            var dog = await _context.Dogs.FindAsync(id);

            if (dog == null)
            {
                return NotFound();
            }
            return dog;
        }

        [HttpPost]
        public async Task<ActionResult<Dogs>> Postdog(DogsDTO createdogDto)
        {
            var dog = new Dogs
            {
                Nombre = createdogDto.Nombre,
                Peso = createdogDto.Peso,
                Estatura = createdogDto.Estatura,
                Raza = createdogDto.Raza,
            };

            _context.Dogs.Add(dog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Getdog), new { id = dog.Id }, dog);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Putdog(int id, Dogs dog)
        {
            if (id != dog.Id)
            {
                return BadRequest();
            }

            _context.Entry(dog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!dogExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletedog(int id)
        {
            var dog = await _context.Dogs.FindAsync(id);
            if (dog == null)
            {
                return NotFound();
            }

            _context.Dogs.Remove(dog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool dogExists(int id)
        {
            return _context.Dogs.Any(e => e.Id == id);
        }
    }
}