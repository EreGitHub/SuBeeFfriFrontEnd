import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  ValidarLetras(input: string): boolean {
    const pattern = new RegExp('^[A-Z]+$', 'i');
    return !pattern.test(input)
  }
}
