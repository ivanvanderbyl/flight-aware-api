export interface FlightAwareData {
  FlightInfoExResult: FlightInfoExResult
}

export interface FlightInfoExResult {
  next_offset: number
  flights: FAFlight[]
}

export interface FAFlight {
  faFlightID: string
  ident: string
  aircrafttype: string
  filed_ete: string
  filed_time: number
  filed_departuretime: number
  filed_airspeed_kts: number
  filed_airspeed_mach: string
  filed_altitude: number
  route: string
  actualdeparturetime: number
  estimatedarrivaltime: number
  actualarrivaltime: number
  diverted: string
  origin: string
  destination: string
  originName: string
  originCity: string
  destinationName: string
  destinationCity: string
}

export interface AirlineFlightInfoStruct {
  bag_claim: string
  codeshares: string[]
  faFlightID: string
  gate_dest: string
  gate_orig: string
  ident: string
  meal_service: string
  seats_cabin_business: number
  seats_cabin_coach: number
  seats_cabin_first: number
  tailnumber: string
  terminal_dest: string
  terminal_orig: string
}

export interface AirlineInfoResult {
  callsign: string
  country: string
  location: string
  name: string
  phone: string
  shortname: string
  url: string
}

export interface AllAirlinesResult {
  data: string[]
}
