import { Injectable } from '@nestjs/common'
import { DateTime } from 'luxon'
import puppeteer from 'puppeteer'

@Injectable()
export class LeumiService {
  async parse(login: string, password: string, card: string) {
    const browser = await puppeteer.launch({ headless: true,  args: ['--no-sandbox', '--disable-setuid-sandbox'], })
    const page = await browser.newPage()

    await page.goto('https://hb2.bankleumi.co.il/staticcontent/gate-keeper/he/')

    await page.evaluate(() => {
      const [loginInput, passwordInput] = Array.from(
        document.querySelectorAll<HTMLInputElement>('input'),
      )
      loginInput.id = 'loginInput'
      passwordInput.id = 'passwordInput'

      const [, , button] = Array.from(document.querySelectorAll('button'))
      button.id = 'loginButton'
    })

    await page.type('#loginInput', login)
    await page.type('#passwordInput', password)

    await page.click('#loginButton')

    await page.waitForSelector('.editable-name[leumi-gtm="creditCard"]')

    console.log('Logged in')

    const transfers = await page.evaluate(() => {
      const actions = []
      const accountActions = Array.from(
        document.querySelectorAll('.activity-feed.content li'),
      )
      for (const action of accountActions) {
        // if (!action.querySelector(".icon-cash")) continue;

        const date =
          action.querySelector<HTMLDivElement>('.num.value').innerText
        const value = parseFloat(
          action.querySelector<HTMLDivElement>('.balance-link-color').innerText,
        )

        actions.push({ date, value })
      }
      return actions
    })

    await page.evaluate((cardNumber: string) => {
      const els = document.querySelectorAll<HTMLDivElement>(
        '.editable-name[leumi-gtm="creditCard"]',
      )
      els.forEach((el) => {
        if (el.innerText.includes(cardNumber)) {
          el.id = 'cardTrigger'
        }
      })
    }, card)
    await page.click('#cardTrigger')

    await page.waitForSelector('div[role="table"]')

    const records = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('div[role="table"]'))
      return tables.map((table, i) => {
        const rows = table.querySelectorAll('.ts-table-row')
        const records: LeumiRecordRaw[] = []

        rows.forEach((row, i) => {
          const data: LeumiRecordRaw = {
            date: '',
            shop: '',
            value: 0,
          }
          if (i === 0) return
          const cells =
            row.querySelectorAll<HTMLDivElement>('.ts-table-row-item')

          let _date = ''

          if (cells.length === 6) {
            cells.forEach((cell, i) => {
              if (i === 0) {
                _date = cell.innerText.trim()
              }

              if (i === 1) {
                _date += ' ' + cell.innerText.trim()
              }

              if (i === 2) {
                data.shop = cell.innerText.trim()
              }

              if (i === 5) {
                data.value = parseFloat(cell.innerText.trim())
              }
            })
          } else {
            cells.forEach((cell, i) => {
              if (i === 1) {
                _date = cell.innerText.trim()
              }

              if (i === 2) {
                data.shop = cell.innerText.trim()
              }

              if (i === 3) {
                data.value = parseFloat(cell.innerText.trim())
              }
            })
          }

          if (data.value) {
            data.date = _date
            records.push(data)
          }
        })

        return records
      })
    })

    await browser.close()

    return {
      records: records.flat().map((r) => ({
        ...r,
        date: DateTime.fromFormat(
          r.date,
          r.date.includes(' ') ? 'dd.MM.yy HH:mm' : 'dd.MM.yy',
        ).toJSDate(),
      })) as LeumiRecord[],
      transfers: transfers.map((t) => ({
        ...t,
        date: DateTime.fromFormat(
          t.date,
          t.date.includes(' ') ? 'dd.MM.yy HH:mm' : 'dd.MM.yy',
        ).toJSDate(),
      })) as LeumiTransfer[],
    }
  }
}

export type LeumiTransfer = {
  date: Date
  value: number
}

export type LeumiRecord = {
  date: Date
  shop: string
  value: number
}

type LeumiRecordRaw = {
  date: string
  shop: string
  value: number
}
