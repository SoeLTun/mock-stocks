import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { TAG_ALL, Stock, Tag } from '../stocks.models';

/** Service to manage stock data fetching and manipulation. */
@Injectable({
  providedIn: 'root',
})
export class StockService {
  /** URL to json-server. */
  private apiUrl = 'http://localhost:3000';

  /** BehaviorSubject for stocks data. */
  private _stocks$: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);

  /** BehaviorSubject for tags data. */
  private _tags$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {}

  /** Observable for stocks data. */
  public get stocks$(): Observable<Stock[]> {
    return this._stocks$.asObservable();
  }

  /** Observable for tags data. */
  public get tags$(): Observable<string[]> {
    return this._tags$.asObservable();
  }

  /** Fetches stocks data based on the provided tag. */
  public getStocks(tag?: string): void {
    const url = this.getStocksURL(
      tag === TAG_ALL || tag == undefined ? '' : tag
    );
    this.http
      .get<Stock[]>(url)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this._stocks$.next(data || []);
          if (!tag || tag === TAG_ALL) {
            this._tags$.next(this.generateTags(data || []));
          }
        },
        error: (error) => {
          console.error('Error fetching stocks:', error);
          this._stocks$.next([]);
        },
      });
  }

  /** Generates a unique list of tags from the provided stocks. */
  private generateTags(stocks: Stock[]): string[] {
    if (stocks?.length) {
      // Filter out undefined values before creating the Set
      const names = new Set(
        stocks
          .map((stock) => stock.tag)
          .filter((tag): tag is string => tag !== undefined)
      );
      return [TAG_ALL, ...names];
    } else {
      return [TAG_ALL]; // Return 'ALL' if no tags are found
    }
  }

  /** Fetches all stocks and generates tags. */
  public getTags(): void {
    this.getStocks('');
  }

  /** Deletes a stock by ID and refreshes stocks and tags. */
  public deleteStock(id: string, filteredTag?: string) {
    const url = `${this.apiUrl}/stocks/${id}`;
    this.http
      .delete(url)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.getStocks(filteredTag);
        },
        error: (error) => {
          console.error('Error deleting stock:', error);
        },
      });
  }

  /** Constructs the URL for fetching stocks. */
  private getStocksURL(tag: string) {
    const url = `${this.apiUrl}/stocks`;
    if (tag) {
      return `${this.apiUrl}/stocks?tag=${tag}`;
    } else {
    }
    return tag ? `${url}?tag=${tag}` : url;
  }
}
