import test from 'node:test'
import assert from 'node:assert/strict'
import {sourceModule} from '../scripts/source-module.mjs'
const {sitemapXml}=sourceModule('lib/sitemap.ts')
const {guides}=sourceModule('data/guides.ts')

test('the sitemap uses the standard minimal XML format with every public canonical page',()=>{
 const xml=sitemapXml()
 assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'))
 const entries=[...xml.matchAll(/ {2}<url>\n {4}<loc>([^<]+)<\/loc>\n {4}<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>\n {2}<\/url>/g)]
 assert.equal(entries.length,6*(6+guides.length))
 assert.equal(new Set(entries.map(entry=>entry[1])).size,entries.length)
 assert.ok(entries.every(entry=>entry[1].startsWith('https://copero.pro')))
 assert.ok(xml.endsWith('</urlset>\n'))
 assert.ok(!/xhtml:|<priority>|<changefreq>|\/career|www\.copero/.test(xml))
 assert.ok(xml.includes('<loc>https://copero.pro</loc>'))
 assert.ok(xml.includes('<loc>https://copero.pro/zh/guides</loc>'))
})
