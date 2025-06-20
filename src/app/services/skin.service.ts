import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkinService {
  constructor(private http: HttpClient) {}

  private caseFiles = [
    'fever',
    'fracture',
    "recoil",
    "kilowatt",
    "revolution",
    "dreamsxnightmares",
    "gallery"
  ];

  private rarityOrder = [
    'Consumer Grade',
    'Industrial Grade',
    'Mil-Spec',
    'Restricted',
    'Classified',
    'Covert',
    'Exceedingly Rare',
    'Extraordinary'
  ];

  getAllCases() {
    const requests = this.caseFiles.map(filename =>
    this.http
      .get(`${filename}.html`, { responseType: 'text' })
      .pipe(
        map(html => ({case: filename.replace('.html', ''), skins: this.parseSkins(html)}))
      )
  );

    let retour = forkJoin(requests).pipe(
      map(groups =>
        groups.map(group => ({
          ...group,
          skins: group.skins
          .map((skin: any) => ({
            ...skin,
            averagePrice: this.getAveragePrice(skin)
          }))
          .sort((a:any, b:any) => {
            const aIndex = this.rarityOrder.findIndex(r => a.rarity?.includes(r));
            const bIndex = this.rarityOrder.findIndex(r => b.rarity?.includes(r));

            if (aIndex !== bIndex) return bIndex - aIndex;

            return this.getHighestPrice(b) - this.getHighestPrice(a); // prix max décroissant
          })
        }))
      ));

      return retour;
  }

  private getHighestPrice = (skin: any): number => {
    let max = 0;

    for (const price of skin.prices || []) {
      const matches = [...price.matchAll(/(\d{1,3}(?:[ .,]\d{3})*)(?:,(\d+))?/g)];

      for (const match of matches) {
        const euros = match[1].replace(/\s|\./g, '').replace(',', '.');
        const decimals = match[2] || '00';
        const val = parseFloat(euros + '.' + decimals);

        if (!isNaN(val)) {
          max = Math.max(max, val);
        }
      }
    }

    return max;
  };

  private getAveragePrice = (skin: any): number => {
    let total = 0;
    let count = 0;

    for (const price of skin.prices || []) {
      const matches = [...price.matchAll(/(\d{1,3}(?:[ .,]\d{3})*)(?:,(\d+))?/g)];

      const numbers: number[] = [];

      for (const match of matches) {
        const euros = match[1].replace(/\s|\./g, '').replace(',', '.');
        const decimals = match[2] || '00';
        const val = parseFloat(euros + '.' + decimals);
        if (!isNaN(val)) {
          numbers.push(val);
        }
      }

      if (numbers.length === 2) {
        const avg = (numbers[0] + numbers[1]) / 2;
        total += avg;
        count++;
      } else if (numbers.length === 1) {
        total += numbers[0];
        count++;
      }
    }

    return count > 0 ? parseFloat((total / count).toFixed(2)) : 0;
  };

  private parseSkins(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const blocks = doc.querySelectorAll('.well.result-box');
    const results: any = [];

    blocks.forEach(block => {
      const title = block.querySelector('h3')?.innerText?.trim(); // "AWP | Printstream"
      const prices = Array.from(block.querySelectorAll('.price p a')).map(a => a.textContent?.trim());
      const imageUrl = block.querySelector('img')?.getAttribute('src');
      const rarity = block.querySelector('.quality p')?.textContent?.trim();

      if (title && prices.length > 0) {
        results.push({
          name: title,
          prices: prices,
          img:imageUrl,
          rarity:rarity
        });
      }
    });

    return results;
  }
}