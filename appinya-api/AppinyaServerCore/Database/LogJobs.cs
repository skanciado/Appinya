using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    public partial class LogJobs
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(200)]
        public string Descripcio { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DataInici { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DataFi { get; set; }
        public bool Finalitzat { get; set; }
        [StringLength(200)]
        public string Error { get; set; }
    }
}
