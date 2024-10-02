using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ws_people.src.Data;
using ws_people.src.models;
using ws_people.src.DTO;

namespace ws_people.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _context;

        public UsersController(UserContext context)
        {
            _context = context;
        }

       [HttpGet]
public async Task<ActionResult> GetUsers()
{
    try
    {
        var users = await _context.Users.ToListAsync();
        return Ok(new { data = users });
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}

        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                return user;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Users>> PostUser(CreateUserDto createUserDto)
        {
            try
            {
                var user = new Users
                {
                    Nombre = createUserDto.Nombre,
                    Apellidos = createUserDto.Apellidos,
                    Estatura = createUserDto.Estatura,
                    Sexo = createUserDto.Sexo,
                    Contraseña = BCrypt.Net.BCrypt.HashPassword(createUserDto.Contraseña)
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new { message = "Usuario creado con éxito", user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, Users user)
        {
            if (id != user.Id)
            {
                return BadRequest(new { message = "ID de usuario no coincide" });
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Usuario actualizado con éxito" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }
                else
                {
                    return StatusCode(500, "Error de concurrencia al actualizar el usuario.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Usuario eliminado con éxito" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDTO loginUserDto)
        {
            try
            {
                var user = await _context.Users.SingleOrDefaultAsync(u => u.Nombre == loginUserDto.Nombre);

                if (user == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                if (!BCrypt.Net.BCrypt.Verify(loginUserDto.Contraseña, user.Contraseña))
                {
                    return Unauthorized(new { message = "Credenciales inválidas" });
                }

                return Ok(new { message = "Login exitoso", user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}


/*CREATE TABLE [dbo].[Users] (
[Id] INT IDENTITY(1,1) NOT NULL,

[Nombre]     NVARCHAR (255) NULL,

[Apellidos]  NVARCHAR (255) NULL,

[Estatura]   FLOAT (53)     NULL,

[Sexo]       NVARCHAR (50)  NULL,

[Contraseña] NVARCHAR (255) NULL,
PRIMARY KEY CLUSTERED ([Id] ASC)
);
*/