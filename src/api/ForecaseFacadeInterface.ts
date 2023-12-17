import { Weather } from "./Weather";

export interface ForecastFacadeI {
  getAllPaginated(page: number): Weather[];
  getForecastById(id: string, name: string): Weather[];
  searchByTerm(term: string): Weather[];
}
