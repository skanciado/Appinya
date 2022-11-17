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
  DROP TABLE log;

 CREATE TABLE [dbo].[Log](
	[Id] int NOT NULL IDENTITY    PRIMARY KEY,
	[Data] datetime NOT NULL default Getdate(),
	[Accio] [varchar](100) NOT NULL,
	[Objecte] [varchar](100) NOT NULL,
	[ObjecteId] int,
	[Descripcio] [varchar](200), 
	[Usuari] [varchar](100)
); 