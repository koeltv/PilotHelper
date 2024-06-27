export class Route {
  constructor(
    public origin: string,
    public route: string,
    public destination: string,
    public hours1: string | null,
    public hours2: string | null,
    public hours3: string | null,
    public type: string,
    public area: string | null,
    public altitude: string | null,
    public aircraft: string | null,
    public flow: string,
    public seq: number,
    public d_artcc: string,
    public a_artcc: string
  ) {
  }
}
