import * as Collections from 'typescript-collections';
import { Restaurant } from '../classes/restaurant';

type History = { filterUrl: string, result: Restaurant[] };
export class SearchHistory {
	/*
	 * Search history saves the 10 latest search results, using filter url as the query key;
	 * The head element (oldest search result) is popped when the queue is full.
	 */
	// expected type: Queue<{ filterUrl: string, result: Restaurant[] }>

	history_queue = new Collections.Queue();
	max_len: number;

	constructor(max_len?: number) {
		max_len ? this.max_len = max_len: this.max_len = 10;
	}

	set_maxLen(len: number): void {
		this.max_len = len;
	}

	add(searchEvent : History): void {
		if (this.history_queue.size() >= this.max_len)
			this.history_queue.dequeue();

		this.history_queue.enqueue(searchEvent);
	}

	search_history(filterUrl: string): any {
		let result = null;

		this.history_queue.forEach((search) => {
			if (search['filterUrl'] == filterUrl) {
				result = search['result'];
				return false; // short circuit the search loop
			}
		});

		return result;
	}

	clear_history(): void {
		this.history_queue.clear();
	}
}
