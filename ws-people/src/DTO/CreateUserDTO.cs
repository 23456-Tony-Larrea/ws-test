namespace ws_people.src.models
{
    public class CreateUserDto
    {
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public float Estatura { get; set; }
        public string Sexo { get; set; }
        public string Contraseña { get; set; }
  
    }
}