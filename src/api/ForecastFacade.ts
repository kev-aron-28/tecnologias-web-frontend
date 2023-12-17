import { database } from "./DailyForecast";
import { ForecastFacadeI } from "./ForecaseFacadeInterface";
import { Weather } from "./Weather";

export class ForecastFacade implements ForecastFacadeI {
  public getAllPaginated(lastIndex: number = 0): Weather[] {
    const dayZeroRecords = database.filter((record) => record.ndia == "0").slice(lastIndex, lastIndex + 5)
    return dayZeroRecords.map(record => new Weather(
      record.idmun, 
      record.nes, 
      record.nmun, 
      record.desciel,
      Number(record.probprec), 
      Number(record.tmax), 
      Number(record.tmin),
      Number(record.velvien),
      Number(record.cc)
    ))
  }
  
  public getForecastById(id: string, name: string): Weather[] {
    const filteredRecords = database.filter((record) => record.idmun == id && record.nmun == name)
    return filteredRecords.map((record) => {
      const weather = new Weather(
        record.idmun, 
        record.nes, 
        record.nmun, 
        record.desciel,
        Number(record.probprec), 
        Number(record.tmax), 
        Number(record.tmin),
        Number(record.velvien),
        Number(record.cc)
      )
      weather.day = Number(record.ndia)
      return weather
    })
  }

  public searchByTerm(term: string): Weather[] {
    const dayZeroRecords = database.filter((record) => record.ndia == "0")
    const filteredRecords = dayZeroRecords.filter((record) => 
      record.nes.toLowerCase().includes(term.toLowerCase()) || 
      record.nmun.toLowerCase().includes(term.toLowerCase())
    )
    return filteredRecords.map((record) => {
      const weather = new Weather(
        record.idmun, 
        record.nes, 
        record.nmun, 
        record.desciel,
        Number(record.probprec), 
        Number(record.tmax), 
        Number(record.tmin),
        Number(record.velvien),
        Number(record.cc)
      )
      return weather
    })
  }
}
