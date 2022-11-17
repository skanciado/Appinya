/**
 *  Appinya Open Source Project
 *  Copyright (C) 2020  Daniel Horta Vidal
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
/**
 * Interface per comparar
 */
export interface IComparable {
  
  /**
   * Metode per comparar 
   * @param obj 
   */
  comparar(obj: Comparable): boolean;
}
export abstract class Comparable implements IComparable {

  public Id?:string;
  /**
 * Metode per comparar 
 * @param obj 
 */
  comparar(obj: Comparable): boolean {
    if (!obj) return false;
    
    if (this.Id){
      return obj.Id == this.Id;
    }else 
    return JSON.stringify(this) == JSON.stringify(obj)
  }
}
export class ComprableUtils { 


  static comparar(obj1: any,obj2: any): boolean {
    if (!obj1) return false;
    if (!obj2) return false;

    if (obj1.Id){
      return obj1.Id == obj2.Id;
    }else 
    return JSON.stringify(obj2) == JSON.stringify(obj1)
  }
  
}