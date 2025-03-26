import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stock, StockDetailsItem } from '../../stocks.models';

/**
 * StockDetailComponent displays detailed information about a stock.
 */
@Component({
  selector: 'app-stock-detail',
  standalone: false,
  templateUrl: './stock-detail.component.html',
  styleUrl: './stock-detail.component.scss',
})
export class StockDetailComponent {
  /** Array of stock detail items. */
  protected stockDetailsItem: StockDetailsItem[] = [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Name', key: 'name' },
    { label: 'Market Cap', key: 'marketCap' },
    { label: 'Tag', key: 'tag' },
  ];

  /** Input stock data, or null if none. */
  @Input() public stock!: Stock | null;

  /** Output event for closing detail panel. */
  @Output() public onClose = new EventEmitter<boolean>();

  /** Emits close event. */
  public closeStockDetail() {
    this.onClose.emit(true);
  }
}
