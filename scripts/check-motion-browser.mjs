// Supply PLAYWRIGHT_MODULE when Playwright is available outside this project.
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const baseUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4174/'
import assert from 'node:assert/strict'
const browser=await chromium.launch({channel:'chrome',headless:true})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
await page.goto(baseUrl)
await page.waitForLoadState('networkidle')
async function visit(selector,index=0,offset=0){await page.locator(selector).nth(index).evaluate((el,offset)=>scrollTo({top:el.getBoundingClientRect().top+scrollY-innerHeight*.3+offset,behavior:'instant'}),offset);await page.waitForTimeout(1000)}
async function shot(name){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' overflow');await page.screenshot({path:join(tmpdir(), `portfolio-upgrade-${name}.png`)})}
await shot('hero')
await page.evaluate(()=>scrollTo({top:400,behavior:'instant'}));await page.waitForTimeout(300);await shot('hero-mid')
await page.evaluate(()=>scrollTo({top:650,behavior:'instant'}));await page.waitForTimeout(300);await shot('hero-end')
for(let i=0;i<3;i++){await visit('.capability-chapter',i);assert(await page.locator('.capability-chapter').nth(i).evaluate(el=>el.classList.contains('is-current')));await shot(`skills-${i}`)}
for(let i=0;i<4;i++){await visit('.case-chapter',i);assert(await page.locator('.case-chapter').nth(i).evaluate(el=>el.classList.contains('is-current')));await shot(`case-${i}`);const v=page.locator('.case-monitor video');if(await v.count()){await page.waitForTimeout(500);assert(await v.evaluate(el=>!el.paused && el.currentTime>0),'case video plays '+i)}}
await visit('#about');await shot('about')
await page.getByRole('button',{name:'Switch to dark mode',exact:true}).click()
await visit('.case-chapter',1);await shot('case-dark')
await visit('.capability-chapter',1);await shot('skills-dark')
assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).transform),'none')
assert.equal(await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().top),0)
for(const width of [390,320]){
 await page.setViewportSize({width,height:width===390?844:680})
 for(const [selector,name,index] of [['#home','hero',0],['.capability-chapter','skills',1],['.case-chapter','case',0],['.case-chapter','enterprise',3]]){
  await visit(selector,index)
  if(selector!== '#home'){
   const skills=selector.includes('capability')
   await page.locator(skills?'.capability-tabs button':'.case-switcher button').nth(index).click()
   await page.waitForTimeout(1200)
   const heading=await page.locator(selector).nth(index).locator('h3').boundingBox()
   const stage=await page.locator(skills?'.capability-visual':'.case-visual-column').boundingBox()
   assert(heading.y>=stage.y+stage.height,'chapter heading clear of sticky stage')
   assert(await page.locator(selector).nth(index).evaluate(el=>el.classList.contains('is-current')))
  }
  await shot(`mobile-${width}-${name}`)
 }
}
await page.getByRole('button', {name: '切换到中文', exact: true}).click()
await page.waitForTimeout(300)
assert.equal(await page.locator('#skills-title').textContent(), '拆开系统，看看里面。')
await visit('.capability-chapter', 1)
await page.locator('.capability-tabs button').nth(1).click()
await page.waitForTimeout(1000)
await shot('mobile-chinese')
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500)
assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('motion-on')),false)
await visit('.capability-chapter',1);await shot('reduced-skills')
for(const selector of ['.capability-chapter','.case-chapter']){assert.equal(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).opacity),'1')}
assert.equal(errors.length,0,errors.join('\n'))
console.log('PASS: all chapter activations, case video autoplay, responsive overflow, fixed dark navigation, reduced motion, no runtime errors')
await browser.close()
