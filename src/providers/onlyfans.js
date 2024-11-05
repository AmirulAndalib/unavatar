'use strict'

const PCancelable = require('p-cancelable')
const cheerio = require('cheerio')

const getHTML = require('../util/html-get')

module.exports = PCancelable.fn(async function onlyfans ({ input }, onCancel) {
  const promise = getHTML(`https://onlyfans.com/${input}`, {
    prerender: true,
    puppeteerOpts: { abortTypes: ['other', 'image', 'font'] }
  })
  onCancel(() => promise.onCancel())
  const { html } = await promise
  const $ = cheerio.load(html)
  const json = JSON.parse(
    $('script[type="application/ld+json"]').contents().text()
  )
  return json.mainEntity.image
})

module.exports.supported = {
  email: false,
  username: true,
  domain: false
}