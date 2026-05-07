import type { Page } from '@playwright/test';
import { STORAGE_KEYS } from '../utils/constants';
import type { CocktailItem, SessionState, TradingStateRecord } from '../utils/test-data';

type StorageSeed = {
  clear?: boolean;
  items?: CocktailItem[] | null;
  session?: SessionState | null;
  tradingState?: TradingStateRecord | null;
};

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get appPage(): Page {
    return this.page;
  }

  protected escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async prepareStorage(seed: StorageSeed = {}): Promise<void> {
    const payload = {
      clear: seed.clear ?? true,
      entries: [
        {
          key: STORAGE_KEYS.items,
          value: seed.items === undefined ? null : seed.items === null ? null : JSON.stringify(seed.items)
        },
        {
          key: STORAGE_KEYS.session,
          value: seed.session === undefined ? null : seed.session === null ? null : JSON.stringify(seed.session)
        },
        {
          key: STORAGE_KEYS.trading,
          value:
            seed.tradingState === undefined
              ? null
              : seed.tradingState === null
                ? null
                : JSON.stringify(seed.tradingState)
        }
      ]
    };

    await this.page.context().addInitScript(
      ({ clear, entries }: { clear: boolean; entries: Array<{ key: string; value: string | null }> }) => {
        if (clear) {
          localStorage.clear();
        }

        for (const entry of entries) {
          if (entry.value === null) {
            localStorage.removeItem(entry.key);
            continue;
          }

          localStorage.setItem(entry.key, entry.value);
        }
      },
      payload
    );
  }
}
