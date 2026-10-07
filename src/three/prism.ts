import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

/** Two-pass chromatic glass, adapted from the standalone Motion Studies Prism. */
export function createPrism(canvas: HTMLCanvasElement, onLost: () => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.autoClear = false
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100)
  camera.position.z = 10
  const scene = new THREE.Scene(), backdrop = new THREE.Scene()
  const textCanvas = document.createElement('canvas')
  const ctx = textCanvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(textCanvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  const backgroundMaterial = new THREE.ShaderMaterial({
    uniforms: { tex: { value: texture } },
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader: 'varying vec2 vUv;uniform sampler2D tex;void main(){gl_FragColor=texture2D(tex,vUv);\n#include <colorspace_fragment>\n}',
    depthTest: false, depthWrite: false,
  })
  const plane = new THREE.PlaneGeometry(2, 2)
  backdrop.add(new THREE.Mesh(plane, backgroundMaterial))
  const targetBack = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType })
  const targetFront = targetBack.clone()
  const vertex = 'varying vec3 nrm;varying vec3 eye;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);nrm=normalize(normalMatrix*normal);eye=normalize(mv.xyz);gl_Position=projectionMatrix*mv;}'
  const fragment = `precision highp float;
    varying vec3 nrm;varying vec3 eye;uniform sampler2D tex;uniform vec2 res;uniform float backside,power;
    void main(){
      vec2 uv=gl_FragCoord.xy/res;vec3 n=normalize(nrm);if(backside>.5)n=-n;
      vec3 e=normalize(eye);vec3 col=vec3(0.);
      for(int i=0;i<8;i++){
        float slide=float(i)/8.*.045;
        vec2 r=refract(e,n,1./1.15).xy*(power+slide)*.58;
        vec2 y=refract(e,n,1./1.16).xy*(power+slide)*.58;
        vec2 g=refract(e,n,1./1.18).xy*(power+slide*2.)*.58;
        vec2 c=refract(e,n,1./1.22).xy*(power+slide*2.5)*.58;
        vec2 b=refract(e,n,1./1.25).xy*(power+slide*3.)*.58;
        vec2 p=refract(e,n,1./1.28).xy*(power+slide)*.58;
        float R=texture2D(tex,uv+r).r*.5;vec3 Y=texture2D(tex,uv+y).rgb;float yy=(Y.r*2.+Y.g*2.-Y.b)/6.;
        float G=texture2D(tex,uv+g).g*.5;vec3 C=texture2D(tex,uv+c).rgb;float cc=(C.g*2.+C.b*2.-C.r)/6.;
        float B=texture2D(tex,uv+b).b*.5;vec3 P=texture2D(tex,uv+p).rgb;float pp=(P.b*2.+P.r*2.-P.g)/6.;
        col+=vec3(R+(2.*pp+2.*yy-cc)/3.,G+(2.*yy+2.*cc-pp)/3.,B+(2.*cc+2.*pp-yy)/3.);
      }
      col/=8.;vec3 l=normalize(vec3(1.,-1.,-1.));float spec=pow(max(dot(n,normalize(l-e)),0.),90.);
      col+=spec*(backside>.5?.35:1.);float f=pow(clamp(1.+dot(e,n),0.,1.),5.);
      col=mix(col,vec3(1.),f*(backside>.5?.25:.55));gl_FragColor=vec4(col+vec3(.004,.005,.007),1.);
      #include <colorspace_fragment>
    }`
  const material = (back: boolean) => new THREE.ShaderMaterial({
    vertexShader: vertex, fragmentShader: fragment, side: back ? THREE.BackSide : THREE.FrontSide,
    uniforms: { tex: { value: back ? targetBack.texture : targetFront.texture }, res: { value: new THREE.Vector2() }, backside: { value: back ? 1 : 0 }, power: { value: back ? .22 : .3 } },
  })
  const backMaterial = material(true), frontMaterial = material(false)
  const geometry = new RoundedBoxGeometry(1, 1, 1, 8, .12)
  const cube = new THREE.Mesh(geometry, frontMaterial)
  cube.rotation.set(-.42, .62, .18)
  scene.add(cube)
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  let paused = reducedMotion.matches, visible = false, destroyed = false, lost = false
  let frame = 0, lastFrame = 0, dragging = false, pointer = -1, lastX = 0, lastY = 0, vx = 0, vy = 0
  const xAxis = new THREE.Vector3(1, 0, 0), yAxis = new THREE.Vector3(0, 1, 0), quaternion = new THREE.Quaternion()
  function rotate(x: number, y: number) {
    cube.quaternion.premultiply(quaternion.setFromAxisAngle(yAxis, x))
    cube.quaternion.premultiply(quaternion.setFromAxisAngle(xAxis, y))
  }
  function draw() {
    cube.material = backMaterial
    renderer.setRenderTarget(targetBack); renderer.clear(); renderer.render(backdrop, camera)
    renderer.setRenderTarget(targetFront); renderer.clear(); renderer.render(backdrop, camera)
    renderer.clearDepth(); renderer.render(scene, camera)
    cube.material = frontMaterial
    renderer.setRenderTarget(null); renderer.clear(); renderer.render(backdrop, camera)
    renderer.clearDepth(); renderer.render(scene, camera)
  }
  function tick(time: number) {
    frame = 0
    if (destroyed || lost || !visible || document.hidden) return
    const dt = Math.min((time - (lastFrame || time)) / 1000, .04)
    lastFrame = time
    if (!paused && !reducedMotion.matches && !dragging) {
      rotate((vx + .0018) * dt * 60, (vy + .0005) * dt * 60)
      vx *= Math.pow(.93, dt * 60); vy *= Math.pow(.93, dt * 60)
    }
    draw()
    if (!paused && !reducedMotion.matches) schedule()
  }
  function schedule() { if (!frame && !destroyed && !lost && visible && !document.hidden) frame = requestAnimationFrame(tick) }
  function layout() {
    if (destroyed || lost) return
    const width = canvas.clientWidth, height = canvas.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    const dpr = renderer.getPixelRatio()
    targetBack.setSize(width * dpr, height * dpr); targetFront.setSize(width * dpr, height * dpr)
    for (const m of [backMaterial, frontMaterial]) m.uniforms.res!.value.set(width * dpr, height * dpr)
    camera.aspect = width / height; camera.updateProjectionMatrix()
    textCanvas.width = Math.round(width * dpr); textCanvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#090c11'; ctx.fillRect(0, 0, width, height)
    const size = Math.min(width * .205, height * .225)
    ctx.textAlign = 'center'; ctx.font = `700 ${size}px "Space Grotesk", sans-serif`
    ctx.fillStyle = '#f0efe8'
    ctx.fillText('NATHAN', width * .5, height * .43, width * .9)
    ctx.fillText('SHAN', width * .5, height * .43 + size * .96)
    ctx.strokeStyle = '#f0efe81a'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(25, height - 94); ctx.lineTo(width - 25, height - 94); ctx.stroke()
    texture.needsUpdate = true
    cube.scale.setScalar(Math.min(width * .45, height * (width < 400 ? .4 : .48)) / height * 5.359)
    cube.position.y = width < 400 ? .6 : .2
    schedule()
  }
  const observer = new ResizeObserver(layout)
  observer.observe(canvas)
  const intersection = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    lastFrame = 0
    if (visible) schedule()
    else { cancelAnimationFrame(frame); frame = 0; dragging = false; pointer = -1 }
  }, { threshold: 0 })
  intersection.observe(canvas)
  function down(event: PointerEvent) {
    if (event.button !== 0 || pointer !== -1) return
    pointer = event.pointerId; dragging = true; vx = vy = 0
    lastX = event.clientX; lastY = event.clientY
    canvas.setPointerCapture(event.pointerId)
  }
  function move(event: PointerEvent) {
    if (!dragging || pointer !== event.pointerId) return
    vx = Math.max(-.12, Math.min(.12, (event.clientX - lastX) * .007))
    vy = event.pointerType === 'touch' ? 0 : Math.max(-.12, Math.min(.12, (event.clientY - lastY) * .007))
    rotate(vx, vy); lastX = event.clientX; lastY = event.clientY; schedule()
  }
  function release(event: PointerEvent) {
    if (event.pointerId !== pointer) return
    if (canvas.hasPointerCapture(pointer)) canvas.releasePointerCapture(pointer)
    pointer = -1; dragging = false
  }
  function visibility() { lastFrame = 0; if (document.hidden) { cancelAnimationFrame(frame); frame = 0 } else schedule() }
  function preference() { vx = vy = 0; schedule() }
  function contextLost(event: Event) { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; onLost() }
  canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release)
  canvas.addEventListener('lostpointercapture', release); canvas.addEventListener('webglcontextlost', contextLost)
  document.addEventListener('visibilitychange', visibility)
  reducedMotion.addEventListener('change', preference)
  document.fonts.ready.then(() => { if (!destroyed) layout() })
  layout()
  return {
    reduced: reducedMotion.matches,
    rotate(direction: number) { rotate(direction * Math.PI / 5, 0); vx = vy = 0; schedule() },
    pause(value: boolean) { paused = value; vx = vy = 0; schedule() },
    dispose() {
      destroyed = true; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect()
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', release); canvas.removeEventListener('pointercancel', release)
      canvas.removeEventListener('lostpointercapture', release); canvas.removeEventListener('webglcontextlost', contextLost)
      document.removeEventListener('visibilitychange', visibility); reducedMotion.removeEventListener('change', preference)
      geometry.dispose(); plane.dispose(); texture.dispose(); backgroundMaterial.dispose()
      backMaterial.dispose(); frontMaterial.dispose(); targetBack.dispose(); targetFront.dispose(); renderer.dispose()
    },
  }
}
