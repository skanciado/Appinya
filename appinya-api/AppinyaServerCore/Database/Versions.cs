using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("VERSIONS")]
    public partial class Versions
    {
        [Key]
        [Column("ID_VERSIO")]
        public int IdVersio { get; set; }
        [Required]
        [Column("VERSIO")]
        [StringLength(20)]
        public string Versio { get; set; }
        [Column("DESCRIPCIO")]
        [StringLength(200)]
        public string Descripcio { get; set; }
        [Column("REFRESCAR_MODEL")]
        public bool RefrescarModel { get; set; }
        [Column("ACTUALITZACIO_APP")]
        public bool ActualitzacioApp { get; set; }
        [Column("ULTIMAVERSIO")]
        public bool Ultimaversio { get; set; }
        [Column("IND_ESBORRAT")]
        public bool IndEsborrat { get; set; }
        [Column("DATA_CREACIO", TypeName = "date")]
        public DateTime DataCreacio { get; set; }
    }
}
