
export class Filter {

  get url(): string {
    let options = [];
    for (let key in this)
      if (this[key] && typeof this[key] !== 'function')
        options.push(key + '=' + this[key]);

    return options.join(';')
  }
}

export class RecipeFilter extends Filter {
  keyword: string = '';
  cuisine: string = '';
  diet: string = '';
  intolerance: string = '';

  constructor() { super() }
}

export class RestaurantFilter extends Filter {

  public lat: number = -33.8858032;
  public lng: number = 151.1883326;


  constructor() { super() }
}
