export class Geometry {
  constructor(
    public type: string,
    public coordinates: number[]
  ) {
  }
}

export class Elevation {
  constructor(
    public value: number,
    public unit: number,
    public referenceDatum: number
  ) {
  }
}

export class Airport {
  constructor(
    public _id: string,
    public name: string,
    public icaoCode: string | null,
    public iataCode: string | null,
    public altIdentifier: string | null,
    public type: number,
    public country: string,
    public geometry: Geometry,
    public elevation: Elevation,
    public isPrivate: boolean
  ) {
  }
}
