export class AircraftEquipment {
  constructor(
    public uhfPost: boolean,
    public vhfPost: boolean,
    public rdbaBeacon: boolean,
    public survivalEquipmentPolar: boolean,
    public survivalEquipmentDesert: boolean,
    public survivalEquipmentMaritime: boolean,
    public survivalEquipmentJungle: boolean,
    public safetyJacketWithLight: boolean,
    public safetyJacketWithFluorescein: boolean,
    public safetyJacketWithUHF: boolean,
    public safetyJacketWithVHF: boolean,
    public raftCount: number,
    public raftCapacity: number,
    public raftCoverageColor: string
  ) {
  }
}
