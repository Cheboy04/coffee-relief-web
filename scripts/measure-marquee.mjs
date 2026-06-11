import { chromium } from 'playwright'

const b = await chromium.launch()
const p = await b.newPage()
await p.setViewportSize({ width: 1280, height: 900 })
await p.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 })

const info = await p.evaluate(() => {
  const section = document.querySelector('section[aria-label="Por qu\xE9 Coffee Relief"]')
  if (!section) return { error: 'section not found' }
  const wrapper = section.querySelector('.overflow-hidden')
  const track = wrapper ? wrapper.firstElementChild : null
  const uls = track ? Array.from(track.querySelectorAll('ul')) : []
  const trackW = track ? track.offsetWidth : null
  const ulW = uls[0] ? uls[0].offsetWidth : null
  return {
    viewport: window.innerWidth,
    trackW,
    ulCount: uls.length,
    ulW,
    oneThirdTrack: trackW ? Math.round(trackW / 3) : null,
    ulMatchesOneThird: ulW && trackW ? Math.abs(ulW - trackW / 3) < 2 : null,
    animName: track ? getComputedStyle(track).animationName : null,
  }
})

console.log(JSON.stringify(info, null, 2))
await b.close()
