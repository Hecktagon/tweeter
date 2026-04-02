export class DataPage<T> {
  public values: T[]; // page of values returned by the database
  public hasMorePages: boolean; // Indicates whether there are more pages of data available to be retrieved

  constructor(values: T[], hasMorePages: boolean) {
    this.values = values;
    this.hasMorePages = hasMorePages;
  }
}