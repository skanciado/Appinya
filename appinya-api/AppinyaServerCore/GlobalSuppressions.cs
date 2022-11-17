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
// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Globalization", "CA1305:Especificar IFormatProvider", Justification = "No es treballar amb internacionalització", Scope = "module")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Globalization", "CA1307:Especificar IFormatProvider", Justification = "No es treballar amb internacionalització", Scope = "module")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Globalization", "CA1304:Especificar CultureInfo", Justification = "No es treballar amb internacionalització", Scope = "module")]

[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1056:Las propiedades URI no deben ser cadenas", Justification = "Son variables de retorno Web Api", Scope = "module")]

[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Reliability", "CA2007:Puede llamar a ConfigureAwait en la tarea esperada", Justification = "No aplica en proyectos Web API", Scope = "module")]

[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Usage", "CA2225:Las sobrecargas del operador tienen alternativas con nombre", Justification = "<pendiente>", Scope = "module")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Usage", "CA2227:Las propiedades de colección deben ser de solo lectura", Justification = "Puede suprimir la advertencia si la propiedad forma parte de una clase", Scope = "module")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Naming", "CA1707:Los identificadores no deben contener caracteres de subrayado", Justification = "Me gustan los subrayados y punto :D ", Scope = "module")]
