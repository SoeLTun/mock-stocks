import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksOverviewComponent } from './stocks-overview.component';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { Stock, TAG_ALL } from '../../stocks.models';
import { ClarityModule } from '@clr/angular';
import { ReactiveFormsModule } from '@angular/forms';

describe('StocksOverviewComponent', () => {
  let component: StocksOverviewComponent;
  let fixture: ComponentFixture<StocksOverviewComponent>;
  let stockServiceSpy: jasmine.SpyObj<StockService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: any;
  beforeEach(async () => {
    stockServiceSpy = jasmine.createSpyObj(
      'StockService',
      ['getStocks', 'getTags', 'deleteStock'],
      {
        stocks$: new Subject<Stock[]>(),
        tags$: new Subject<string[]>(),
      }
    );
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = {
      queryParams: of({ tag: 'TestTag' }),
    };

    await TestBed.configureTestingModule({
      declarations: [StocksOverviewComponent],
      imports: [ClarityModule, ReactiveFormsModule],
      providers: [
        { provide: StockService, useValue: stockServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StocksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selectedTag from route queryParams', () => {
    expect(component.selectedTag).toBe('TestTag');
    expect(component.filterCtr.value).toBe('TestTag');
  });

  it('should call getStocks and getTags on ngOnInit', () => {
    component.ngOnInit();
    expect(stockServiceSpy.getStocks).toHaveBeenCalledWith('TestTag');
    expect(stockServiceSpy.getTags).toHaveBeenCalled();
  });

  it('should set stocks from stockService.stocks$', () => {
    const mockStocks: Stock[] = [{ id: 'AAPL', symbol: 'AAPL' }];
    (stockServiceSpy.stocks$ as Subject<Stock[]>).next(mockStocks);
    expect(component.stocks).toEqual(mockStocks);
  });

  it('should set tags from stockService.tags$', () => {
    const mockTags: string[] = ['Tech', 'Finance'];
    (stockServiceSpy.tags$ as Subject<string[]>).next(mockTags);
    expect(component.tags).toEqual(mockTags);
  });

  it('should navigate on filterCtr value change', () => {
    component.filterCtr.setValue('NewTag');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/stocks'], {
      queryParams: { tag: 'NewTag' },
    });
    expect(stockServiceSpy.getStocks).toHaveBeenCalledWith('NewTag');
    expect(component.selectedStock).toBeNull();
  });

  it('should set selectedStock on viewStockDetails', () => {
    const mockStock: Stock = { id: 'AAPL', symbol: 'AAPL' };
    component.viewStockDetails(mockStock);
    expect(component.selectedStock).toEqual(mockStock);
  });

  it('should toggle selectedStock on viewStockDetails', () => {
    const mockStock: Stock = { id: 'AAPL', symbol: 'AAPL' };
    component.viewStockDetails(mockStock);
    component.viewStockDetails(mockStock);
    expect(component.selectedStock).toBeNull();
  });

  it('should call deleteStock on deleteStock', () => {
    component.selectedStock = { id: 'AAPL', symbol: 'AAPL' };
    component.deleteStock('AAPL');

    expect(stockServiceSpy.deleteStock).toHaveBeenCalledWith('AAPL', 'TestTag');
    expect(component.selectedStock).toBeNull();
  });
});
