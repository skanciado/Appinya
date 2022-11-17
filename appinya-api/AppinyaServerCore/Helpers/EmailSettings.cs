/**
 *  Appinya Open Source Project
 *  Copyright (C) 2019  Daniel Horta Vidal
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as
 *   published by the Free Software Foundation, either version 3 of the
 *   License, or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppinyaServerCore.Helpers
{
    public class EmailSettings
    {
        public Boolean MailingEnable { get; set; }
        public String MailingTest { get; set; }
        
        public string Server { get; set; }
        public Int32 Port { get; set; }
        public Boolean SSL { get; set; }
        public String From { get; set; }
        public String UsuariPrincipal { get; set; }
        public String ContrasenyaPrincipal { get; set; }
        public String UsuariSupport { get; set; }
        public String ContrasenyaSupport { get; set; }        
        public String TemlateError { get; set; }
        public String TemplateSuport { get; set; }

        public String TemplateComisions { get; set; }
        public String TemplateConfirmacio { get; set; }
        public String TemplateContrasenya { get; set; }
        public String TemplateAssistencia { get; set; }
        public String TemplateConvocatoria { get; set; }
        public String TemplateExportacio { get; set; }
        public String TemplateAlbums { get; set; }
        public String TemplateNoticies { get; set; }

        public String TemplateBenvinguda { get; set; }
        
    }
}
