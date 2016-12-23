export class Restaurant {

  name: string;
  categories: any[];

  id: string;
  url: string;
  image: string;
  rating: number;

  lat: number;
  lng: number;
  distance: number;
  address: string;

  bookmarked: boolean;

  constructor(restData? : {}) {
    if (restData)
      for (let key in restData)
        this[key] = restData[key];
  }

  flatterned_categories(): string[] {
    return this.categories.map((c) => c['category']);
  }
}
