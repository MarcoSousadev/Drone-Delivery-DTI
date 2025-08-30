class Velocity {
  public currentSpeed: number
  public openAirSpeed: number
  public inDownTownSpeed: number

  constructor (currentSpeed: number, openAirSpeed: number, inDownTownSpeed: number ){
    this.currentSpeed = currentSpeed
    this.openAirSpeed = openAirSpeed
    this.inDownTownSpeed = inDownTownSpeed
  }

}