import fetch from 'isomorphic-unfetch'
import { stringify } from 'query-string'
import {
  FlightInfoExResult,
  AirlineFlightInfoStruct,
  AirlineInfoResult,
  AllAirlinesResult,
} from './types/FlightAware'

export type APIMethod =
  | 'FlightInfo'
  | 'FlightInfoEx'
  | 'AirlineFlightInfo'
  | 'AirlineInfo'
  | 'AllAirlines'

const API_URL = 'http://flightxml.flightaware.com/json/FlightXML2'

export default class FlightAware {
  constructor(private username: string, private apiKey: string) {}

  public async flightInfo(ident: string): Promise<FlightInfoExResult> {
    return this.apiCall<FlightInfoExResult>('FlightInfoEx', { ident })
  }

  public async airlineFlightInfo(faFlightID: string): Promise<AirlineFlightInfoStruct> {
    return this.apiCall<AirlineFlightInfoStruct>('AirlineFlightInfo', { faFlightID })
  }

  public async airlineInfo(airlineCode: string): Promise<AirlineInfoResult> {
    return this.apiCall<AirlineInfoResult>('AirlineInfo', { airlineCode })
  }

  public async allAirlines(): Promise<AllAirlinesResult> {
    return this.apiCall<AllAirlinesResult>('AllAirlines', {})
  }

  /**
   * This endpoint costs ~$10 to call, be careful.
   */
  public async detailedAirlineInfo() {
    let airlines = await this.allAirlines()
    let list = []
    for (const airlineCode of airlines.data) {
      console.log(airlineCode)
      let data = await this.airlineInfo(airlineCode)
      list.push({ ...data, airlineCode })
    }

    return list
  }

  private async apiCall<T>(method: APIMethod, args: any): Promise<T> {
    let queryString = stringify(args)
    return fetch(`${API_URL}/${method}?${queryString}`, {
      credentials: 'include',
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.username}:${this.apiKey}`).toString('base64')}`,
      },
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          return {}
        }
      })
      .then(data => {
        return data[`${method}Result`]
      })
  }
}
