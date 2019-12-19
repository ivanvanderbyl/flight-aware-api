import fetch from 'isomorphic-unfetch'
import { stringify } from 'query-string'
import {
  FlightAwareData,
  FlightInfoExResult,
  AirlineFlightInfoStruct,
  AirlineInfoResult,
  AllAirlinesResult,
} from './types/FlightAware'

const API_URL = 'http://flightxml.flightaware.com/json/FlightXML2'

type Methods = 'FlightInfoExResult' | string
type FlightAwareResponse<T> = Record<string, T>

export default class FlightAware {
  constructor(private username: string, private apiKey: string) {}

  public async flightInfo(ident: string): Promise<FlightInfoExResult | null> {
    return this.apiCall<FlightInfoExResult>('FlightInfoEx', { ident })
  }

  public async airlineFlightInfo(faFlightID: string): Promise<AirlineFlightInfoStruct | null> {
    return this.apiCall<AirlineFlightInfoStruct>('AirlineFlightInfo', { faFlightID })
  }

  public async airlineInfo(airlineCode: string): Promise<AirlineInfoResult | null> {
    return this.apiCall<AirlineInfoResult>('AirlineInfo', { airlineCode })
  }

  public async allAirlines(): Promise<AllAirlinesResult | null> {
    return this.apiCall<AllAirlinesResult>('AllAirlines', {})
  }

  private async apiCall<T>(method: string, args: any): Promise<T | null> {
    let queryString = stringify(args)
    return fetch(`${API_URL}/${method}?${queryString}`, {
      credentials: 'include',
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.username}:${this.apiKey}`).toString('base64')}`,
      },
    })
      .then<FlightAwareResponse<T> | null>(res => {
        if (res.ok) {
          return res.json() as PromiseLike<FlightAwareResponse<T>>
        } else {
          return null
        }
      })
      .then(data => {
        let resultKey = `${method}Result`
        if (data && resultKey in (data as any)) return data[resultKey]
        return null
      })
  }
}
