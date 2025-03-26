import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { Stock, TAG_ALL } from '../stocks.models';
import { HttpClient } from '@angular/common/http';
import { of, skip, throwError } from 'rxjs';

describe('StockService', () => {
  let service: StockService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const mockStocks: Stock[] = [
    {
      id: 'GOOGL',
      symbol: 'GOOGL',
      lastPrice: 2729.23,
      name: 'Alphabet Inc.',
      marketCap: 1820000000000,
      tag: 'watching',
    },
    {
      id: 'AMZN',
      symbol: 'AMZN',
      lastPrice: 3402.72,
      name: 'Amazon.com Inc.',
      marketCap: 1700000000000,
      tag: 'toSell',
    },
    {
      id: 'MSFT',
      symbol: 'MSFT',
      lastPrice: 299.35,
      name: 'Microsoft Corporation',
      marketCap: 2240000000000,
      tag: 'favorite',
    },
  ];
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'delete']);
    httpClientSpy.get.and.returnValue(of([]));
    TestBed.configureTestingModule({
      providers: [
        StockService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });
    service = TestBed.inject(StockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStocks()', () => {
    it('should fetch stocks successfully', (done) => {
      httpClientSpy.get.and.returnValue(of(mockStocks));

      service.getStocks();

      service.stocks$.subscribe((stocks) => {
        expect(stocks).toEqual(mockStocks);
        done();
      });

      expect(httpClientSpy.get).toHaveBeenCalled();
    });
    it('should handle fetch stocks error', (done) => {
      httpClientSpy.get.and.returnValue(throwError(() => new Error('404')));

      service.stocks$.pipe(skip(1)).subscribe((stocks) => {
        expect(stocks).toEqual([]);
        done();
      });

      service.getStocks();
      expect(httpClientSpy.get).toHaveBeenCalled();
    });
  });

  describe('getTags()', () => {
    it('should call getStocks with empty string', () => {
      const spy = spyOn(service as any, 'getStocks').and.callThrough();
      httpClientSpy.get.and.returnValue(of(mockStocks));
      service.getTags();
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('deleteStock()', () => {
    it('should call deleteStock and refresh stocks', () => {
      httpClientSpy.delete.and.returnValue(of({}));
      spyOn(service, 'getStocks');

      service.deleteStock('1', 'Tech');

      expect(httpClientSpy.delete).toHaveBeenCalledWith(
        'http://localhost:3000/stocks/1'
      );
      expect(service.getStocks).toHaveBeenCalledWith('Tech');
    });
  });
});
