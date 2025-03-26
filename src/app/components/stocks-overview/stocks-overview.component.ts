import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Stock, TAG_ALL } from '../../stocks.models';
import { FormControl } from '@angular/forms';
import { ComboboxModel } from '@clr/angular/forms/combobox/model/combobox.model';
import { Subscription, take } from 'rxjs';

/**
 * Component for displaying and managing stocks overview.
 * Allows filtering stocks by tags, viewing stock details, and deleting stocks.
 */
@Component({
  selector: 'app-stocks-overview',
  standalone: false,
  templateUrl: './stocks-overview.component.html',
  styleUrl: './stocks-overview.component.scss',
})
export class StocksOverviewComponent implements OnInit, OnDestroy {
  /** List of stocks retrieved from the service */
  public stocks: Stock[] | undefined;

  /** List of available tags for filtering stocks */
  public tags: string[] | undefined;

  /** Currently selected stock for viewing details */
  public selectedStock: Stock | null = null;

  /** Currently selected tag for filtering stocks */
  public selectedTag: string = '';

  /** Form control for managing the filter selection */
  public filterCtr = new FormControl();

  /** Subscriptions to be unsubscribed on destroy */
  private subscriptions: Subscription[] = [];

  constructor(
    private stockService: StockService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const routeSub = this.route.queryParams
      .pipe(take(1))
      .subscribe((params) => {
        this.selectedTag = params['tag'];
        this.filterCtr.patchValue(this.selectedTag);
      });
    this.subscriptions.push(routeSub);
  }

  /**
   * Fetches stocks and tags based on the selected tag and sets up subscriptions.
   */
  public ngOnInit(): void {
    if (this.selectedTag && this.selectedTag !== TAG_ALL) {
      this.stockService.getTags();
    }
    this.stockService.getStocks(this.selectedTag);

    const stocksSub = this.stockService.stocks$.subscribe((data) => {
      this.stocks = data;
    });
    this.subscriptions.push(stocksSub);

    const tagsSub = this.stockService.tags$.subscribe((data) => {
      this.tags = data;
    });
    this.subscriptions.push(tagsSub);

    // Listen to filter selection change and fetch stocks based on new value
    const filterSub = this.filterCtr.valueChanges.subscribe((selectedTag) => {
      this.selectedStock = null;
      this.router.navigate(['/stocks'], {
        queryParams: { tag: selectedTag },
      });
      this.stockService.getStocks(selectedTag);
    });
    this.subscriptions.push(filterSub);
  }

  /**
   * Toggles the stock details view.
   * @param stock The stock to display details for
   */
  public viewStockDetails(stock: Stock): void {
    this.selectedStock = this.selectedStock?.id !== stock.id ? stock : null;
  }

  /**
   * Deletes a stock by its ID and refreshes the list based on the selected tag.
   * @param stockId ID of the stock to be deleted
   */
  public deleteStock(stockId: string): void {
    if (this.selectedStock?.id === stockId) {
      this.selectedStock = null;
    }
    this.stockService.deleteStock(stockId, this.selectedTag);
  }

  /**
   * Lifecycle hook that runs when the component is destroyed.
   * Unsubscribes from all active subscriptions.
   */
  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
