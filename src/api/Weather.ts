export class Weather {
  public day: number = 0
  constructor(
    public id: string,
    public nEst: string,
    public nMun: string,
    public skyDesc: string,
    public precipitationProb: number,
    public tMax: number,
    public tMin: number,
    public velWind: number,
    public clouds: number
  ) {}
}
