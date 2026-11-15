import assert from 'node:assert/strict'

const port = process.env.PORT ?? '3000'
assert.match(port, /^\d+$/)
const base = `http://127.0.0.1:${port}`

function post(path, body) {
  return fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  })
}

const home = await fetch(base, { signal: AbortSignal.timeout(30_000) })
assert.equal(home.status, 200)
const html = await home.text()
assert.match(html, /<title>Nexus - AI Parametric Design<\/title>/)
assert.match(html, />Nexus<\/span>/)
assert.match(html, /href="\/icon\.svg"/)
const icon = await fetch(`${base}/icon.svg`, { signal: AbortSignal.timeout(10_000) })
assert.equal(icon.status, 200)
assert.match(await icon.text(), /<svg/)
console.log('Nexus homepage, metadata, and favicon passed')

const missing = await post('/api/compile', {})
assert.equal(missing.status, 400)
assert.equal((await missing.json()).error, 'Missing "code" in body')

const compiled = await post('/api/compile', {
  code: 'from build123d import Box\nresult = Box(10, 20, 30)\n',
})
if (!compiled.ok) throw new Error(`Compilation failed (${compiled.status}): ${await compiled.text()}`)
assert.equal(compiled.headers.get('content-type'), 'application/octet-stream')
const stl = Buffer.from(await compiled.arrayBuffer())
assert.equal(stl.length, 684)
assert.equal(stl.readUInt32LE(80), 12)

const header = compiled.headers.get('x-geometry-metrics')
assert.ok(header)
const metrics = JSON.parse(header)
assert.equal(metrics.error, undefined)
assert.deepEqual(metrics.dimensions, [10, 20, 30])
assert.equal(metrics.volume, 6000)
assert.equal(metrics.face_count, 6)
assert.equal(metrics.is_valid, true)
console.log('Build123d-to-STL compilation and geometry metrics passed')
