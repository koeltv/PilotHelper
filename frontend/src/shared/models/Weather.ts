export class Cloud {
  constructor(
    public cover: string,
    public base: number | null
  ) {
  }
}

export class Weather {
  constructor(
    public metar_id: number,
    public icaoId: string,
    public receiptTime: string,
    public obsTime: number,
    public reportTime: string,
    public temp: number,
    public dewp: number,
    public wdir: number,
    public wspd: number,
    public wgst: string | null,
    public visib: string,
    public altim: number,
    public slp: string | null,
    public qcField: number,
    public wxString: string | null,
    public presTend: string | null,
    public maxT: string | null,
    public minT: string | null,
    public maxT24: string | null,
    public minT24: string | null,
    public precip: string | null,
    public pcp3hr: string | null,
    public pcp6hr: string | null,
    public pcp24hr: string | null,
    public snow: string | null,
    public vertVis: string | null,
    public metarType: string,
    public rawOb: string,
    public mostRecent: number,
    public lat: number,
    public lon: number,
    public elev: number,
    public prior: number,
    public name: string,
    public clouds: Cloud[]
  ) {
  }
}
