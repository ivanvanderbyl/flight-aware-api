require('dotenv').config({ path: __dirname + '/.env' })
import FlightAware from '..'
import { of, from } from 'rxjs'
import { bufferCount, mergeAll, mergeMap, concatMap } from 'rxjs/operators'
import { writeFileSync, readFileSync } from 'fs'

class AirlineFetcher {
  private flightAware: FlightAware
  constructor(private startFrom?: string) {
    this.flightAware = new FlightAware(process.env.FA_USERNAME!, process.env.FA_API_KEY!)
  }

  /**
   * This endpoint costs ~$10 to call, be careful.
   */
  public async detailedAirlineInfo() {
    let airlines = await this.flightAware.allAirlines()
    let list = airlines?.data || []
    if (this.startFrom) {
      let start = list.findIndex(item => item === this.startFrom)
      list = list.slice(start + 1)
    }

    return of(list ?? []).pipe(
      mergeMap(items => from(items)),
      bufferCount(5),
      concatMap(items => {
        return Promise.all(
          items.map(async item => {
            let data: any = await this.flightAware.airlineInfo(item)
            data.airlineCode = item
            return data
          }),
        )
      }),

      mergeAll(),
    )
  }
}

async function main() {
  let records: any[] = JSON.parse(readFileSync('./all-airlines.json', { encoding: 'utf8' })) ?? []
  let [latest] = records?.slice(-1)

  console.log(latest)

  let airlines = new AirlineFetcher(latest?.airlineCode)

  let stream = await airlines.detailedAirlineInfo()
  let list: any[] = records

  stream.subscribe({
    next: (item: any) => {
      list.push(item)
      console.log(`Airline: ${item.airlineCode} count: ${list.length}`)
    },
    error(err) {
      console.log('Encounted an error', err)
      writeFileSync('./all-airlines.json', JSON.stringify(list), { encoding: 'utf8' })
    },
    complete() {
      console.log(`Completed loading ${list.length} airports`)
      writeFileSync('./all-airlines.json', JSON.stringify(list), { encoding: 'utf8' })
      console.log('Done')
    },
  })
}

main()
