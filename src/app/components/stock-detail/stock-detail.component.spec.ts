import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDetailComponent } from './stock-detail.component';
import { Stock } from '../../stocks.models';
import { By } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';

describe('StockDetailComponent', () => {
  let component: StockDetailComponent;
  let fixture: ComponentFixture<StockDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockDetailComponent],
      imports: [ClarityModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StockDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display stock details when stock is provided', () => {
    const mockStock: Stock = {
      id: 'AAPL',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      marketCap: 2000000000000,
      tag: 'Tech',
    };
    component.stock = mockStock;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Symbol : AAPL');
    expect(fixture.nativeElement.textContent).toContain('Name : Apple Inc.');
    expect(fixture.nativeElement.textContent).toContain(
      'Market Cap : 2000000000000'
    );
    expect(fixture.nativeElement.textContent).toContain('Tag : Tech');
  });

  it('should not display stock details when stock is null', () => {
    component.stock = null;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Symbol');
    expect(fixture.nativeElement.textContent).not.toContain('Name');
    expect(fixture.nativeElement.textContent).not.toContain('Market Cap');
    expect(fixture.nativeElement.textContent).not.toContain('Tag');
  });

  it('should emit onClose event when closeStockDetail is called', () => {
    const onCloseSpy = spyOn(component.onClose, 'emit');

    component.closeStockDetail();

    expect(onCloseSpy).toHaveBeenCalledWith(true);
  });

  it('should call closeStockDetail when close button is clicked', () => {
    const mockStock: Stock = {
      id: 'AAPL',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      marketCap: 2000000000000,
      tag: 'Tech',
    };
    component.stock = mockStock;
    fixture.detectChanges();
    const closeButton = fixture.debugElement.query(
      By.css('.card-title-close-icon')
    );
    expect(closeButton).toBeTruthy(); // ✅ Ensure the button exists
    const closeStockDetailSpy = spyOn(component, 'closeStockDetail');

    closeButton.triggerEventHandler('click', null);
    expect(closeStockDetailSpy).toHaveBeenCalled();
  });
});
