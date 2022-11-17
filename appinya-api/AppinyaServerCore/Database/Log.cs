using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    public partial class Log
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime Data { get; set; }
        [Required]
        [StringLength(100)]
        public string Accio { get; set; }
        [Required]
        [StringLength(100)]
        public string Objecte { get; set; }
        public int? ObjecteId { get; set; }
        [StringLength(200)]
        public string Descripcio { get; set; }
        [StringLength(100)]
        public string Usuari { get; set; }
    }
}
