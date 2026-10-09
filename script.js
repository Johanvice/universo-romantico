/* ============================================
   CONFIGURACIÓN EDITABLE
   ============================================ */
const CONFIG = {
    flores: [
        { archivo: 'flor1.png',  mensaje: 'Gracias por estar siempre ahí, en las buenas y en las no tan buenas. Eres una amiga increíble. 💜' },
        { archivo: 'flor2.png',  mensaje: 'Hay personas que llegan a tu vida y la hacen más bonita. Tú eres una de ellas. ✨' },
        { archivo: 'flor3.png',  mensaje: 'Espero que nunca olvides lo especial que eres y lo mucho que vales. 🌸' },
        { archivo: 'flor4.png',  mensaje: 'Por cada momento compartido, gracias. Nuestra amistad es uno de mis mayores tesoros. 💜' },
        { archivo: 'flor5.png',  mensaje: 'Que este pequeño universo te recuerde lo mucho que significas para mí como amiga. ✨' },
        { archivo: 'flor6.png',  mensaje: 'Siempre tendrás un lugar muy especial en mi vida. Eso nunca va a cambiar. 💜' },
        { archivo: 'flor7.png',  mensaje: 'Eres una de esas personas que hacen el mundo más bonito solo con existir. 🌸' },
        { archivo: 'flor8.png',  mensaje: 'Gracias por existir y por ser tú, exactamente como eres. Te aprecio muchísimo. 💜' },
        { archivo: 'flor9.png',  mensaje: 'Gracias por ser mi persona segura en quien confiar. 💜' },
        { archivo: 'flor10.png', mensaje: 'Contigo hasta los días grises se vuelven bonitos. 🌸' },
        { archivo: 'flor11.png', mensaje: 'Ojalá la vida te devuelva todo lo bonito que das. ✨' },
        { archivo: 'flor12.png', mensaje: 'Nuestra amistad es uno de mis mejores regalos. 🎁' },
        { archivo: 'flor13.png', mensaje: 'A tu lado hasta el silencio es cómodo. 💜' },
        { archivo: 'flor14.png', mensaje: 'Gracias por escucharme siempre, incluso sin palabras. ✨' },
        { archivo: 'flor15.png', mensaje: 'Si algún día dudas, recuerda que aquí estoy. 💜' },
        { archivo: 'flor16.png', mensaje: 'Tu forma de ver el mundo me inspira. 🌸' },
        { archivo: 'flor17.png', mensaje: 'Eres una persona imprescindible en mi vida. ¡Te quiero! 💜' },
        { archivo: 'flor18.png', mensaje: 'Cada recuerdo contigo es un tesoro. ✨' },
        { archivo: 'flor19.png', mensaje: 'Gracias por ser mi lugar favorito. 🌸' },
        { archivo: 'flor20.png', mensaje: 'Nunca dejes de ser tan auténtica. 💜' }
    ],
    frasesFlotantes: [
        'Siempre juntos 💜',
        'Gracias por existir ✨',
        'Amistad infinita 💜',
        'Momentos que nunca se olvidan',
        'Eres especial 🌸',
        'Nuestro pequeño universo'
    ],
    musica: 'musicas.mp3'
};

/* ============================================
   PUNTO DEL CORAZÓN
   ============================================ */
function getHeartPoint(t, scale = 1) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: x * scale, y: y * scale };
}

/* ============================================
   VARIABLES GLOBALES
   ============================================ */
let scene, camera, renderer;
let galaxyPoints, heartParticles, heartGlow, coreLightSprite, nebulaSprite;
let heartTextSprite = null;
let floresObjects = [];
let floresDescubiertas = 0;
let totalFlores = 0;
let audio;
let musicaIniciada = false;
let musicaSilenciada = false;
let animacionActiva = true;
let tiempo = 0;

let isDragging = false;
let cameraCurrent = { x: 0, y: 3, z: 30 };
let rotationVelocity = { x: 0, y: 0 };
let cameraZoom = 1;
let cameraZoomTarget = 1;
let lastInteractionTime = 0;
let orbitAngleX = 0;
let orbitAngleY = 0;

let slowMotionFactor = 1;

let entranceCanvas, entranceCtx;
let entranceParticles = [];
let entranceHeartParticles = [];
let entranceNebulaBlobs = [];
let entranceSparkles = [];
let entranceRings = [];
let entranceAnimId;

let universeCanvas;
let warpCanvas, warpCtx;
let warpActive = false;
let warpStars = [];
let warpAnimId;

let finalCanvas, finalCtx;
let finalParticles = [];
let finalAnimId;

let touchStartTime = 0;
let touchStartPos = { x: 0, y: 0 };
let touchMoved = false;
let lastTouchPos = { x: 0, y: 0 };
let touchVelocity = { x: 0, y: 0 };
let lastTouchTime = 0;
let touchStartDist = 0;

const HEART_Y = 4.5;
const raycaster = new THREE.Raycaster();
const pointerVec = new THREE.Vector2();

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    initEntrance();
    setupEventListeners();
});

function initEntrance() {
    entranceCanvas = document.getElementById('entrance-canvas');
    entranceCtx = entranceCanvas.getContext('2d');
    resizeEntranceCanvas();
    createEntranceParticles();
    createEntranceHeart();
    createEntranceNebula();
    createEntranceSparkles();
    createEntranceRings();
    animateEntrance();
}

function resizeEntranceCanvas() {
    if (!entranceCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    entranceCanvas.width = window.innerWidth * dpr;
    entranceCanvas.height = window.innerHeight * dpr;
    entranceCanvas.style.width = window.innerWidth + 'px';
    entranceCanvas.style.height = window.innerHeight + 'px';
    entranceCtx.setTransform(1, 0, 0, 1, 0, 0);
    entranceCtx.scale(dpr, dpr);
}

/* ============================================
   ENTRADA
   ============================================ */
function createEntranceParticles() {
    entranceParticles = [];
    const count = window.innerWidth < 768 ? 120 : 220;
    for (let i = 0; i < count; i++) {
        entranceParticles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 2 + 0.4,
            speedX: (Math.random() - 0.5) * 0.18,
            speedY: (Math.random() - 0.5) * 0.18,
            opacity: Math.random() * 0.7 + 0.25,
            color: Math.random() > 0.7 ? '#d8a8ff' : (Math.random() > 0.5 ? '#9b5fe8' : '#ffffff'),
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

function createEntranceNebula() {
    entranceNebulaBlobs = [];
    const count = window.innerWidth < 768 ? 5 : 8;
    for (let i = 0; i < count; i++) {
        entranceNebulaBlobs.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: 150 + Math.random() * 250,
            color: Math.random() > 0.5
                ? 'rgba(120, 50, 200, 0.14)'
                : (Math.random() > 0.5 ? 'rgba(180, 100, 240, 0.10)' : 'rgba(90, 30, 160, 0.12)'),
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.12
        });
    }
}

function createEntranceSparkles() {
    entranceSparkles = [];
    const count = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < count; i++) {
        entranceSparkles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2.5 + 1,
            life: Math.random(),
            speed: 0.005 + Math.random() * 0.01,
            phase: Math.random() * Math.PI * 2
        });
    }
}

function createEntranceRings() {
    entranceRings = [
        { radius: 130, opacity: 0.25, speed: 0.4, angle: 0, tilt: 0.5 },
        { radius: 200, opacity: 0.18, speed: -0.3, angle: 1.5, tilt: -0.3 },
        { radius: 280, opacity: 0.12, speed: 0.25, angle: 3, tilt: 0.7 }
    ];
}

function createEntranceHeart() {
    entranceHeartParticles = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 - 90;
    const scale = Math.min(window.innerWidth, window.innerHeight) * 0.0035;
    const count = window.innerWidth < 768 ? 150 : 260;

    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const p = getHeartPoint(t, scale);
        entranceHeartParticles.push({
            baseX: centerX + p.x + (Math.random() - 0.5) * 8,
            baseY: centerY - p.y + (Math.random() - 0.5) * 8,
            radius: Math.random() * 2.8 + 1.2,
            phase: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.7 + 0.3,
            color: Math.random() > 0.7 ? '#ffffff' : (Math.random() > 0.4 ? '#d8a8ff' : '#9b5fe8')
        });
    }
}

function animateEntrance() {
    entranceAnimId = requestAnimationFrame(animateEntrance);
    const w = window.innerWidth;
    const h = window.innerHeight;

    const gradient = entranceCtx.createRadialGradient(w/2, h/2 - 50, 0, w/2, h/2, Math.max(w, h) * 0.75);
    gradient.addColorStop(0, '#2a0c4a');
    gradient.addColorStop(0.35, '#1a0a2e');
    gradient.addColorStop(0.7, '#0d0518');
    gradient.addColorStop(1, '#000000');
    entranceCtx.fillStyle = gradient;
    entranceCtx.fillRect(0, 0, w, h);

    entranceNebulaBlobs.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -n.radius) n.x = w + n.radius;
        if (n.x > w + n.radius) n.x = -n.radius;
        if (n.y < -n.radius) n.y = h + n.radius;
        if (n.y > h + n.radius) n.y = -n.radius;

        const nebGrad = entranceCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        nebGrad.addColorStop(0, n.color);
        nebGrad.addColorStop(1, 'transparent');
        entranceCtx.fillStyle = nebGrad;
        entranceCtx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
    });

    const time = Date.now() * 0.001;

    entranceRings.forEach(ring => {
        ring.angle += ring.speed * 0.005;
        entranceCtx.save();
        entranceCtx.translate(w/2, h/2 - 90);
        entranceCtx.rotate(ring.angle * ring.tilt);
        entranceCtx.beginPath();
        entranceCtx.ellipse(0, 0, ring.radius, ring.radius * 0.35, 0, 0, Math.PI * 2);
        entranceCtx.strokeStyle = `rgba(200, 140, 255, ${ring.opacity})`;
        entranceCtx.lineWidth = 1.5;
        entranceCtx.shadowBlur = 20;
        entranceCtx.shadowColor = 'rgba(200, 140, 255, 0.7)';
        entranceCtx.stroke();
        entranceCtx.restore();
    });
    entranceCtx.shadowBlur = 0;

    entranceParticles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        p.twinkle += 0.05;
        const alpha = p.opacity * (0.6 + Math.sin(p.twinkle) * 0.4);

        entranceCtx.beginPath();
        entranceCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        entranceCtx.fillStyle = p.color;
        entranceCtx.globalAlpha = alpha;
        entranceCtx.shadowBlur = 10;
        entranceCtx.shadowColor = p.color;
        entranceCtx.fill();
    });
    entranceCtx.globalAlpha = 1;
    entranceCtx.shadowBlur = 0;

    entranceSparkles.forEach(s => {
        s.life += s.speed;
        if (s.life > 1) {
            s.life = 0;
            s.x = Math.random() * w;
            s.y = Math.random() * h;
        }
        const alpha = Math.sin(s.life * Math.PI);
        if (alpha <= 0) return;

        entranceCtx.save();
        entranceCtx.translate(s.x, s.y);
        entranceCtx.strokeStyle = `rgba(220, 180, 255, ${alpha})`;
        entranceCtx.lineWidth = 1.5;
        entranceCtx.shadowBlur = 15;
        entranceCtx.shadowColor = 'rgba(220, 180, 255, 1)';

        entranceCtx.beginPath();
        entranceCtx.moveTo(-s.size * 3, 0);
        entranceCtx.lineTo(s.size * 3, 0);
        entranceCtx.moveTo(0, -s.size * 3);
        entranceCtx.lineTo(0, s.size * 3);
        entranceCtx.stroke();
        entranceCtx.restore();
    });

    const heartbeat = 1 + Math.sin(time * 2) * 0.06;

    entranceHeartParticles.forEach(p => {
        const dx = p.baseX - w/2;
        const dy = p.baseY - (h/2 - 90);
        const drawX = w/2 + dx * heartbeat + Math.sin(time + p.phase) * 3;
        const drawY = (h/2 - 90) + dy * heartbeat + Math.cos(time + p.phase) * 3;
        const glow = 0.5 + Math.sin(time * 3 + p.phase) * 0.5;

        entranceCtx.beginPath();
        entranceCtx.arc(drawX, drawY, p.radius * heartbeat, 0, Math.PI * 2);
        entranceCtx.fillStyle = p.color;
        entranceCtx.globalAlpha = p.opacity * (0.6 + glow * 0.4);
        entranceCtx.shadowBlur = 18;
        entranceCtx.shadowColor = '#d8a8ff';
        entranceCtx.fill();
    });
    entranceCtx.globalAlpha = 1;
    entranceCtx.shadowBlur = 0;
}

/* ============================================
   TRANSICIÓN WARP
   ============================================ */
function startWarpTransition() {
    warpCanvas = document.getElementById('warp-canvas');
    warpCanvas.classList.remove('hidden');
    void warpCanvas.offsetWidth;
    warpCanvas.classList.add('active');

    warpCtx = warpCanvas.getContext('2d');
    resizeWarpCanvas();

    warpStars = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 300 : 600;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.max(window.innerWidth, window.innerHeight) * 1.2;
        warpStars.push({
            x: cx,
            y: cy,
            angle: angle,
            radius: radius,
            prevRadius: radius,
            speed: 0.02 + Math.random() * 0.04,
            length: 0,
            color: Math.random() > 0.6 ? '#ffffff' : (Math.random() > 0.5 ? '#d8a8ff' : '#9b5fe8')
        });
    }

    warpActive = true;
    animateWarp();
}

function resizeWarpCanvas() {
    if (!warpCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    warpCanvas.width = window.innerWidth * dpr;
    warpCanvas.height = window.innerHeight * dpr;
    warpCanvas.style.width = window.innerWidth + 'px';
    warpCanvas.style.height = window.innerHeight + 'px';
    warpCtx.setTransform(1, 0, 0, 1, 0, 0);
    warpCtx.scale(dpr, dpr);
}

function animateWarp() {
    if (!warpActive) return;
    warpAnimId = requestAnimationFrame(animateWarp);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    const bgGrad = warpCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
    bgGrad.addColorStop(0, 'rgba(90, 25, 170, 0.85)');
    bgGrad.addColorStop(0.3, 'rgba(50, 15, 100, 0.5)');
    bgGrad.addColorStop(0.7, 'rgba(20, 5, 40, 0.3)');
    bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    warpCtx.fillStyle = bgGrad;
    warpCtx.fillRect(0, 0, w, h);

    warpCtx.lineCap = 'round';
    warpStars.forEach(s => {
        s.prevRadius = s.radius;
        s.speed *= 1.015;
        s.radius += s.radius * s.speed * 0.15;

        const x1 = cx + Math.cos(s.angle) * s.prevRadius;
        const y1 = cy + Math.sin(s.angle) * s.prevRadius * 0.95;
        const x2 = cx + Math.cos(s.angle) * s.radius;
        const y2 = cy + Math.sin(s.angle) * s.radius * 0.95;

        const lineW = Math.max(1, Math.min(4, s.radius / 200));
        warpCtx.lineWidth = lineW;
        warpCtx.strokeStyle = s.color;
        warpCtx.globalAlpha = Math.min(1, 0.4 + s.radius / 800);
        warpCtx.shadowBlur = 12;
        warpCtx.shadowColor = s.color;

        warpCtx.beginPath();
        warpCtx.moveTo(x1, y1);
        warpCtx.lineTo(x2, y2);
        warpCtx.stroke();

        if (s.radius > Math.max(w, h) * 1.4) {
            s.radius = 5 + Math.random() * 20;
            s.speed = 0.02 + Math.random() * 0.04;
            s.angle = Math.random() * Math.PI * 2;
        }
    });

    warpCtx.globalAlpha = 1;
    warpCtx.shadowBlur = 0;

    const centerGlow = warpCtx.createRadialGradient(cx, cy, 0, cx, cy, 180);
    centerGlow.addColorStop(0, 'rgba(230, 200, 255, 0.9)');
    centerGlow.addColorStop(0.3, 'rgba(180, 120, 255, 0.5)');
    centerGlow.addColorStop(0.7, 'rgba(120, 60, 220, 0.2)');
    centerGlow.addColorStop(1, 'transparent');
    warpCtx.fillStyle = centerGlow;
    warpCtx.fillRect(0, 0, w, h);
}

/* ============================================
   TRANSICIÓN HACIA EL UNIVERSO
   ============================================ */
function enterUniverse() {
    const entranceScreen = document.getElementById('entrance-screen');
    const universeContainer = document.getElementById('universe-container');

    startMusic();
    entranceScreen.classList.add('transitioning');

    setTimeout(() => {
        startWarpTransition();
    }, 600);

    setTimeout(() => {
        entranceScreen.classList.add('hidden');
        universeContainer.classList.remove('hidden');
        initUniverse();

        setTimeout(() => {
            document.getElementById('open-final-btn').classList.remove('hidden');
        }, 2000);

        setTimeout(() => {
            const hint = document.getElementById('discover-hint');
            if (hint) hint.classList.add('fade-out');
        }, 8000);
    }, 2600);

    setTimeout(() => {
        if (warpCanvas) {
            warpCanvas.classList.remove('active');
            setTimeout(() => {
                warpCanvas.classList.add('hidden');
                warpActive = false;
                if (warpAnimId) cancelAnimationFrame(warpAnimId);
                warpStars = [];
            }, 400);
        }
    }, 3400);
}

/* ============================================
   MÚSICA
   ============================================ */
function startMusic() {
    if (musicaIniciada) return;
    audio = new Audio(CONFIG.musica);
    audio.loop = true;
    audio.volume = 0;
    audio.play().then(() => {
        musicaIniciada = true;
        let vol = 0;
        const fadeInterval = setInterval(() => {
            vol += 0.02;
            if (vol >= 0.35) { vol = 0.35; clearInterval(fadeInterval); }
            audio.volume = vol;
        }, 100);
    }).catch(() => {
        console.log('Audio no disponible.');
    });
}

function toggleMusic() {
    if (!audio) return;
    if (musicaSilenciada) {
        audio.volume = 0.35;
        musicaSilenciada = false;
        document.getElementById('music-toggle').classList.remove('muted');
    } else {
        audio.volume = 0;
        musicaSilenciada = true;
        document.getElementById('music-toggle').classList.add('muted');
    }
}

/* ============================================
   UNIVERSO 3D
   ============================================ */
function initUniverse() {
    universeCanvas = document.getElementById('universe-canvas');
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x150630);
    scene.fog = new THREE.FogExp2(0x2a1050, 0.006);
    
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    camera.position.set(0, 4, 30);
    camera.lookAt(0, HEART_Y * 0.6, 0);
    
    renderer = new THREE.WebGLRenderer({
        canvas: universeCanvas,
        antialias: window.devicePixelRatio < 2,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x150630, 1);
    
    const ambientLight = new THREE.AmbientLight(0xc8a0f0, 1.3);
    scene.add(ambientLight);
    
    const hemiLight = new THREE.HemisphereLight(0xe0c8ff, 0x5a2a9a, 1.0);
    scene.add(hemiLight);
    
    const pointLight = new THREE.PointLight(0xe0c0ff, 2.5, 80);
    pointLight.position.set(0, HEART_Y, 6);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xc8a0f0, 1.4, 60);
    pointLight2.position.set(-9, 2, -6);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xb080e0, 1.4, 60);
    pointLight3.position.set(9, -2, -6);
    scene.add(pointLight3);
    
    createCoreLight();
    createNebulaHalo();
    createGalaxy();
    createStars();
    createHeart();
    createHeartText();
    createFlowers();
    createFloatingMessages();
    setupInteraction();
    
    animate();
}

/* ============================================
   LUZ CENTRAL
   ============================================ */
function createCoreLight() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0, 'rgba(255, 240, 255, 1)');
    g.addColorStop(0.12, 'rgba(235, 200, 255, 0.9)');
    g.addColorStop(0.3, 'rgba(200, 140, 255, 0.5)');
    g.addColorStop(0.6, 'rgba(150, 90, 230, 0.2)');
    g.addColorStop(1, 'rgba(90, 40, 170, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
        map: tex, blending: THREE.AdditiveBlending,
        depthWrite: false, transparent: true, opacity: 1
    });
    
    coreLightSprite = new THREE.Sprite(mat);
    coreLightSprite.scale.set(14, 14, 1);
    coreLightSprite.position.set(0, 0, 0);
    scene.add(coreLightSprite);
}

/* ============================================
   NEBULOSA
   ============================================ */
function createNebulaHalo() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0, 'rgba(210, 160, 255, 0.4)');
    g.addColorStop(0.35, 'rgba(170, 110, 245, 0.22)');
    g.addColorStop(0.7, 'rgba(120, 65, 210, 0.08)');
    g.addColorStop(1, 'rgba(70, 25, 140, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
        map: tex, blending: THREE.AdditiveBlending,
        depthWrite: false, transparent: true, opacity: 0.85
    });
    
    nebulaSprite = new THREE.Sprite(mat);
    nebulaSprite.scale.set(50, 50, 1);
    nebulaSprite.position.set(0, 0, -10);
    scene.add(nebulaSprite);
}

/* ============================================
   TEXTO "TE QUIERO" HECHO DE PARTÍCULAS
   ============================================ */
function createHeartText() {
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 1024;
    textCanvas.height = 256;
    const tctx = textCanvas.getContext('2d');
    
    const texto = 'TE QUIERO';
    const fontSize = 170;
    tctx.font = `bold ${fontSize}px "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
    tctx.textAlign = 'center';
    tctx.textBaseline = 'middle';
    tctx.fillStyle = '#ffffff';
    tctx.fillText(texto, textCanvas.width / 2, textCanvas.height / 2);
    
    const imageData = tctx.getImageData(0, 0, textCanvas.width, textCanvas.height);
    const data = imageData.data;
    
    const particles = [];
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 4 : 3;
    
    for (let y = 0; y < textCanvas.height; y += step) {
        for (let x = 0; x < textCanvas.width; x += step) {
            const index = (y * textCanvas.width + x) * 4;
            const alpha = data[index + 3];
            if (alpha > 128) {
                const px = x - textCanvas.width / 2;
                const py = -(y - textCanvas.height / 2);
                const scale = 0.01;
                particles.push({
                    x: px * scale,
                    y: py * scale,
                    offsetZ: (Math.random() - 0.5) * 0.15
                });
            }
        }
    }
    
    const count = particles.length;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorBlanco = new THREE.Color(0xffffff);
    const colorVioleta = new THREE.Color(0xd8a8ff);
    const colorLila = new THREE.Color(0xe0b0ff);
    
    for (let i = 0; i < count; i++) {
        const p = particles[i];
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y + HEART_Y;
        positions[i * 3 + 2] = p.offsetZ + 0.3;
        
        let color;
        const rand = Math.random();
        if (rand > 0.75) color = colorBlanco;
        else if (rand > 0.4) color = colorVioleta;
        else color = colorLila;
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(240,210,255,0.95)');
    gradient.addColorStop(0.5, 'rgba(210,150,255,0.6)');
    gradient.addColorStop(1, 'rgba(130,60,220,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    const material = new THREE.PointsMaterial({
        size: 0.42,
        vertexColors: true,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
    });
    
    heartTextSprite = new THREE.Points(geometry, material);
    scene.add(heartTextSprite);
}

/* ============================================
   GALAXIA
   ============================================ */
function createGalaxy() {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 6000 : 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorMorado = new THREE.Color(0x9b5fe8);
    const colorLila = new THREE.Color(0xd0a8ff);
    const colorAzul = new THREE.Color(0x6a4ac0);
    const colorMagenta = new THREE.Color(0xdd66bb);
    const colorBlanco = new THREE.Color(0xffffff);
    const colorRosa = new THREE.Color(0xe8a8ff);

    const galaxyRadius = 18;
    const ARMS = 3;
    const SPIN = 1.15;
    const ARM_WIDTH = 0.45;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const r = Math.pow(Math.random(), 0.65) * galaxyRadius + 0.5;
        const armIndex = i % ARMS;
        const armAngle = (armIndex / ARMS) * Math.PI * 2;
        const spiralAngle = armAngle + r * SPIN * 0.28;
        const spread = ARM_WIDTH * (0.4 + r / galaxyRadius) * (Math.random() - 0.5) * 2;
        const finalAngle = spiralAngle + spread;
        const verticalThickness = (0.15 + (r / galaxyRadius) * 0.8) * (Math.random() - 0.5) * 2.2;

        positions[i3] = Math.cos(finalAngle) * r;
        positions[i3 + 1] = verticalThickness;
        positions[i3 + 2] = Math.sin(finalAngle) * r;

        let color;
        const rand = Math.random();
        if (r < 3) {
            color = rand > 0.3 ? colorBlanco : colorLila;
        } else if (r < 7) {
            color = rand > 0.55 ? colorMorado : (rand > 0.2 ? colorLila : colorBlanco);
        } else if (r < 13) {
            color = rand > 0.5 ? colorMorado : colorAzul;
        } else {
            color = rand > 0.6 ? colorAzul : (rand > 0.3 ? colorMorado : colorMagenta);
        }
        if (rand > 0.96) color = colorRosa;

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(230,190,255,0.95)');
    gradient.addColorStop(0.7, 'rgba(160,100,230,0.4)');
    gradient.addColorStop(1, 'rgba(90,40,170,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: 0.28,
        vertexColors: true,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
    });

    galaxyPoints = new THREE.Points(geometry, material);
    scene.add(galaxyPoints);

    const dustGeo = new THREE.BufferGeometry();
    const dustCount = isMobile ? 2000 : 4500;
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        const r = Math.pow(Math.random(), 0.7) * galaxyRadius + 0.5;
        const armIndex = i % ARMS;
        const armAngle = (armIndex / ARMS) * Math.PI * 2;
        const spiralAngle = armAngle + r * SPIN * 0.28;
        const spread = ARM_WIDTH * 2.5 * (Math.random() - 0.5);
        const finalAngle = spiralAngle + spread;

        dustPos[i3] = Math.cos(finalAngle) * r + (Math.random() - 0.5) * 1.5;
        dustPos[i3 + 1] = (Math.random() - 0.5) * 2.5;
        dustPos[i3 + 2] = Math.sin(finalAngle) * r + (Math.random() - 0.5) * 1.5;

        const c = new THREE.Color().lerpColors(
            new THREE.Color(0xa060e8),
            new THREE.Color(0x4a2a8a),
            Math.random()
        );
        dustCol[i3] = c.r;
        dustCol[i3 + 1] = c.g;
        dustCol[i3 + 2] = c.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));

    const dustMat = new THREE.PointsMaterial({
        size: 1.1,
        vertexColors: true,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.22,
        sizeAttenuation: true
    });

    const dust = new THREE.Points(dustGeo, dustMat);
    galaxyPoints.add(dust);
}

/* ============================================
   ESTRELLAS
   ============================================ */
function createStars() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 1000 : 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 200;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;
        
        const brightness = Math.random() * 0.6 + 0.4;
        colors[i3] = brightness;
        colors[i3 + 1] = brightness * 0.85;
        colors[i3 + 2] = brightness;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

/* ============================================
   CORAZÓN
   ============================================ */
function createHeart() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 1400 : 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorVioleta = new THREE.Color(0xb070f0);
    const colorLila = new THREE.Color(0xe0b0ff);
    const colorBlanco = new THREE.Color(0xffffff);
    const colorMorado = new THREE.Color(0x8b3fce);
    
    const scale = 0.34;
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const t = (i / count) * Math.PI * 2;
        const p = getHeartPoint(t, scale);
        
        const thickness = 0.55;
        positions[i3] = p.x + (Math.random() - 0.5) * thickness;
        positions[i3 + 1] = p.y + (Math.random() - 0.5) * thickness + HEART_Y;
        positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        
        let color;
        const rand = Math.random();
        if (rand > 0.82) color = colorBlanco;
        else if (rand > 0.5) color = colorVioleta;
        else if (rand > 0.2) color = colorLila;
        else color = colorMorado;
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(240,210,255,0.95)');
    gradient.addColorStop(0.5, 'rgba(210,150,255,0.6)');
    gradient.addColorStop(1, 'rgba(130,60,220,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    const material = new THREE.PointsMaterial({
        size: 0.42,
        vertexColors: true,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
    });
    
    heartParticles = new THREE.Points(geometry, material);
    scene.add(heartParticles);
    
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 512; glowCanvas.height = 512;
    const glowCtx = glowCanvas.getContext('2d');
    const glowGradient = glowCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
    glowGradient.addColorStop(0, 'rgba(230,190,255,0.85)');
    glowGradient.addColorStop(0.25, 'rgba(190,130,255,0.5)');
    glowGradient.addColorStop(0.6, 'rgba(150,90,230,0.16)');
    glowGradient.addColorStop(1, 'rgba(90,40,180,0)');
    glowCtx.fillStyle = glowGradient;
    glowCtx.fillRect(0, 0, 512, 512);
    
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.75
    });
    
    heartGlow = new THREE.Sprite(glowMaterial);
    heartGlow.scale.set(14, 14, 1);
    heartGlow.position.set(0, HEART_Y, -0.5);
    scene.add(heartGlow);
}

/* ============================================
   FLORES — 5 ANILLOS PARA 20 FLORES
   ============================================ */
function createFlowers() {
    const textureLoader = new THREE.TextureLoader();
    const isMobile = window.innerWidth < 768;
    const flowerCount = CONFIG.flores.length;
    totalFlores = flowerCount;

    const anillos = [
        { radius: isMobile ? 6.5 : 8,   yRange: [1, 2],     inclinacion: 0.2 },
        { radius: isMobile ? 9.5 : 11,  yRange: [1.2, 2.3], inclinacion: -0.15 },
        { radius: isMobile ? 12.5 : 14, yRange: [0.8, 2.5], inclinacion: 0.3 },
        { radius: isMobile ? 15.5 : 17, yRange: [1, 2.4],   inclinacion: -0.3 },
        { radius: isMobile ? 18.5 : 20, yRange: [0.8, 2.6], inclinacion: 0.4 }
    ];

    CONFIG.flores.forEach((florConfig, index) => {
        const anillo = anillos[index % anillos.length];
        
        const baseAngle = (index / flowerCount) * Math.PI * 2;
        const angleOffset = (Math.random() - 0.5) * 0.6;
        const angle = baseAngle + angleOffset;
        
        const radius = anillo.radius + (Math.random() - 0.5) * 1.5;
        
        const yBase = anillo.yRange[0] + Math.random() * (anillo.yRange[1] - anillo.yRange[0]);
        const yOffsetIndividual = (Math.random() - 0.5) * 0.6;
        const y = yBase + yOffsetIndividual;
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const yInclinado = y + Math.cos(angle) * anillo.inclinacion;
        
        const flowerGroup = new THREE.Group();
        flowerGroup.position.set(x, yInclinado, z);
        
        const sizeVariation = 0.9 + Math.random() * 0.4;
        
        const hitbox = new THREE.Mesh(
            new THREE.SphereGeometry(3.2, 12, 12),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        flowerGroup.add(hitbox);
        hitbox.userData.index = index;
        flowerGroup.userData.hitbox = hitbox;
        flowerGroup.userData.index = index;
        
        textureLoader.load(
            `flores/${florConfig.archivo}`,
            (texture) => {
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                
                const material = new THREE.SpriteMaterial({
                    map: texture,
                    blending: THREE.NormalBlending,
                    depthWrite: false,
                    transparent: true,
                    opacity: 0.98
                });
                
                const sprite = new THREE.Sprite(material);
                const baseScale = isMobile ? 2.6 : 3.2;
                const scale = baseScale * sizeVariation;
                sprite.scale.set(scale, scale, 1);
                flowerGroup.add(sprite);
                
                const glowCanvas = document.createElement('canvas');
                glowCanvas.width = 128; glowCanvas.height = 128;
                const glowCtx = glowCanvas.getContext('2d');
                const glowGradient = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
                glowGradient.addColorStop(0, 'rgba(220,170,255,0.85)');
                glowGradient.addColorStop(0.5, 'rgba(180,120,245,0.35)');
                glowGradient.addColorStop(1, 'rgba(120,65,210,0)');
                glowCtx.fillStyle = glowGradient;
                glowCtx.fillRect(0, 0, 128, 128);
                
                const glowTexture = new THREE.CanvasTexture(glowCanvas);
                const glowMaterial = new THREE.SpriteMaterial({
                    map: glowTexture,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    transparent: true,
                    opacity: 0.85
                });
                
                const glowSprite = new THREE.Sprite(glowMaterial);
                glowSprite.scale.set(scale * 2.4, scale * 2.4, 1);
                flowerGroup.add(glowSprite);
                
                const particleCount = isMobile ? 15 : 25;
                const pGeo = new THREE.BufferGeometry();
                const pPositions = new Float32Array(particleCount * 3);
                
                for (let p = 0; p < particleCount; p++) {
                    const pAngle = (p / particleCount) * Math.PI * 2;
                    const pRadius = scale * 0.9;
                    pPositions[p * 3] = Math.cos(pAngle) * pRadius;
                    pPositions[p * 3 + 1] = Math.sin(pAngle) * pRadius * 0.8;
                    pPositions[p * 3 + 2] = (Math.random() - 0.5) * 0.5;
                }
                
                pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
                
                const pMaterial = new THREE.PointsMaterial({
                    size: 0.1,
                    color: 0xd4aaff,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    transparent: true,
                    opacity: 0.85,
                    sizeAttenuation: true
                });
                
                const particles = new THREE.Points(pGeo, pMaterial);
                flowerGroup.add(particles);
                
                flowerGroup.userData.config = florConfig;
                flowerGroup.userData.discovered = false;
                flowerGroup.userData.baseY = yInclinado;
                flowerGroup.userData.angle = angle;
                flowerGroup.userData.radius = radius;
                flowerGroup.userData.angularSpeed = 0.0002 + Math.random() * 0.0003;
                flowerGroup.userData.floatPhase = Math.random() * Math.PI * 2;
                flowerGroup.userData.floatSpeed = 0.8 + Math.random() * 0.7;
                flowerGroup.userData.sprite = sprite;
                flowerGroup.userData.glowSprite = glowSprite;
                flowerGroup.userData.particles = particles;
                flowerGroup.userData.anillo = index % anillos.length;
                
                scene.add(flowerGroup);
                floresObjects.push(flowerGroup);
            },
            undefined,
            () => {
                console.warn(`No se pudo cargar flores/${florConfig.archivo}`);
                createFallbackFlower(flowerGroup, florConfig, index, sizeVariation, isMobile);
            }
        );
    });
}

function createFallbackFlower(group, config, index, sizeVariation, isMobile) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const paletas = [
        ['#e0b0ff', '#b070f0'],
        ['#d8a8f5', '#9b5fe8'],
        ['#c8a0f0', '#8b3fce'],
        ['#f0c8ff', '#b880ff'],
        ['#b088e8', '#7b3fbe'],
        ['#e8c0ff', '#a060e0'],
        ['#c8b0f0', '#9050d8'],
        ['#d0a0f0', '#8030c0']
    ];
    const palette = paletas[index % paletas.length];
    
    const cx = size / 2;
    const cy = size / 2;
    const petalCount = 6;
    const petalLength = size * 0.34;
    const petalWidth = size * 0.15;
    
    for (let p = 0; p < petalCount; p++) {
        const ang = (p / petalCount) * Math.PI * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ang);
        
        const grad = ctx.createLinearGradient(0, 0, 0, -petalLength);
        grad.addColorStop(0, palette[1]);
        grad.addColorStop(1, palette[0]);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, -petalLength * 0.6, petalWidth, petalLength * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(-petalWidth * 0.3, -petalLength * 0.75, petalWidth * 0.35, petalLength * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.13);
    centerGrad.addColorStop(0, '#ffffff');
    centerGrad.addColorStop(0.5, '#f0d0ff');
    centerGrad.addColorStop(1, '#b880ff');
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.13, 0, Math.PI * 2);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    const material = new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.NormalBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.98
    });
    
    const sprite = new THREE.Sprite(material);
    const baseScale = isMobile ? 2.6 : 3.2;
    const scale = baseScale * sizeVariation;
    sprite.scale.set(scale, scale, 1);
    group.add(sprite);
    
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128; glowCanvas.height = 128;
    const glowCtx = glowCanvas.getContext('2d');
    const glowGradient = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    glowGradient.addColorStop(0, 'rgba(220,170,255,0.85)');
    glowGradient.addColorStop(0.5, 'rgba(180,120,245,0.35)');
    glowGradient.addColorStop(1, 'rgba(120,65,210,0)');
    glowCtx.fillStyle = glowGradient;
    glowCtx.fillRect(0, 0, 128, 128);
    
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.85
    });
    
    const glowSprite = new THREE.Sprite(glowMaterial);
    glowSprite.scale.set(scale * 2.4, scale * 2.4, 1);
    group.add(glowSprite);
    
    const particleCount = isMobile ? 15 : 25;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    
    for (let p = 0; p < particleCount; p++) {
        const pAngle = (p / particleCount) * Math.PI * 2;
        const pRadius = scale * 0.9;
        pPositions[p * 3] = Math.cos(pAngle) * pRadius;
        pPositions[p * 3 + 1] = Math.sin(pAngle) * pRadius * 0.8;
        pPositions[p * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    
    const pMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xd4aaff,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(pGeo, pMaterial);
    group.add(particles);
    
    group.userData.config = config;
    group.userData.discovered = false;
    group.userData.baseY = group.position.y;
    group.userData.angle = Math.atan2(group.position.z, group.position.x);
    group.userData.radius = Math.sqrt(group.position.x * group.position.x + group.position.z * group.position.z);
    group.userData.angularSpeed = 0.0002 + Math.random() * 0.0003;
    group.userData.floatPhase = Math.random() * Math.PI * 2;
    group.userData.floatSpeed = 0.8 + Math.random() * 0.7;
    group.userData.sprite = sprite;
    group.userData.glowSprite = glowSprite;
    group.userData.particles = particles;
    group.userData.anillo = 0;
    
    scene.add(group);
    floresObjects.push(group);
}

/* ============================================
   TEXTOS FLOTANTES
   ============================================ */
function createFloatingMessages() {
    const container = document.createElement('div');
    container.id = 'floating-messages';
    container.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none; z-index: 15; overflow: hidden;
    `;
    document.getElementById('universe-container').appendChild(container);
    
    function spawnFloatingMessage() {
        if (!animacionActiva) return;
        const frase = CONFIG.frasesFlotantes[Math.floor(Math.random() * CONFIG.frasesFlotantes.length)];
        const el = document.createElement('div');
        el.textContent = frase;
        el.style.cssText = `
            position: absolute;
            left: ${Math.random() * 70 + 15}%;
            top: ${Math.random() * 70 + 15}%;
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            color: rgba(225, 195, 255, 0.85);
            font-size: ${window.innerWidth < 768 ? '0.85rem' : '1rem'};
            letter-spacing: 1px;
            font-weight: 400;
            text-shadow: 0 0 18px rgba(200, 140, 255, 0.95);
            opacity: 0;
            transition: opacity 2s ease, transform 4s ease;
            white-space: nowrap;
            transform: translateY(10px);
        `;
        container.appendChild(el);
        
        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(-10px)';
        });
        
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(-30px)';
            setTimeout(() => {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 2000);
        }, 4500);
        
        setTimeout(spawnFloatingMessage, Math.random() * 5000 + 4000);
    }
    
    setTimeout(spawnFloatingMessage, 3000);
}

/* ============================================
   INTERACCIÓN
   ============================================ */
function setupInteraction() {
    universeCanvas.addEventListener('touchstart', onTouchStart, { passive: false });
    universeCanvas.addEventListener('touchmove', onTouchMove, { passive: false });
    universeCanvas.addEventListener('touchend', onTouchEnd, { passive: false });
    universeCanvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    universeCanvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    universeCanvas.addEventListener('wheel', onWheel, { passive: false });
    universeCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('resize', onResize);
}

function onTouchStart(e) {
    if (e.touches.length === 1) {
        e.preventDefault();
        isDragging = true;
        touchMoved = false;
        touchStartTime = Date.now();
        lastTouchTime = Date.now();
        lastTouchPos.x = e.touches[0].clientX;
        lastTouchPos.y = e.touches[0].clientY;
        touchStartPos.x = e.touches[0].clientX;
        touchStartPos.y = e.touches[0].clientY;
        touchVelocity.x = 0;
        touchVelocity.y = 0;
        rotationVelocity.x = 0;
        rotationVelocity.y = 0;
    } else if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx * dx + dy * dy);
    }
}

function onTouchMove(e) {
    if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        const now = Date.now();
        const dt = Math.max(1, now - lastTouchTime);
        const dx = touch.clientX - lastTouchPos.x;
        const dy = touch.clientY - lastTouchPos.y;
        
        const totalDx = touch.clientX - touchStartPos.x;
        const totalDy = touch.clientY - touchStartPos.y;
        const totalDist = Math.sqrt(totalDx * totalDx + totalDy * totalDy);
        if (totalDist > 10) touchMoved = true;
        
        orbitAngleY += dx * 0.008;
        orbitAngleX += dy * 0.008;
        orbitAngleX = Math.max(-1.2, Math.min(1.2, orbitAngleX));
        
        touchVelocity.x = dx * 0.008 / (dt / 16);
        touchVelocity.y = dy * 0.008 / (dt / 16);
        
        lastTouchPos.x = touch.clientX;
        lastTouchPos.y = touch.clientY;
        lastTouchTime = now;
        lastInteractionTime = now;
    } else if (e.touches.length === 2 && touchStartDist > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = dist / touchStartDist;
        cameraZoomTarget = Math.max(0.5, Math.min(2.5, cameraZoomTarget * delta));
        touchStartDist = dist;
    }
}

function onTouchEnd(e) {
    if (e.touches.length === 0) {
        if (!touchMoved && Date.now() - touchStartTime < 500) {
            const touch = e.changedTouches[0];
            tryFlowerTap(touch.clientX, touch.clientY);
        }
        isDragging = false;
        rotationVelocity.x = touchVelocity.y;
        rotationVelocity.y = touchVelocity.x;
    }
    touchStartDist = 0;
}

function onMouseDown(e) {
    isDragging = true;
    touchMoved = false;
    touchStartTime = Date.now();
    lastTouchPos.x = e.clientX;
    lastTouchPos.y = e.clientY;
    touchStartPos.x = e.clientX;
    touchStartPos.y = e.clientY;
    lastTouchTime = Date.now();
    rotationVelocity.x = 0;
    rotationVelocity.y = 0;
}

function onMouseMove(e) {
    if (!isDragging) return;
    const now = Date.now();
    const dt = Math.max(1, now - lastTouchTime);
    const dx = e.clientX - lastTouchPos.x;
    const dy = e.clientY - lastTouchPos.y;
    
    const totalDx = e.clientX - touchStartPos.x;
    const totalDy = e.clientY - touchStartPos.y;
    const totalDist = Math.sqrt(totalDx * totalDx + totalDy * totalDy);
    if (totalDist > 8) touchMoved = true;
    
    orbitAngleY += dx * 0.006;
    orbitAngleX += dy * 0.006;
    orbitAngleX = Math.max(-1.2, Math.min(1.2, orbitAngleX));
    
    rotationVelocity.x = dy * 0.006 / (dt / 16);
    rotationVelocity.y = dx * 0.006 / (dt / 16);
    
    lastTouchPos.x = e.clientX;
    lastTouchPos.y = e.clientY;
    lastTouchTime = now;
    lastInteractionTime = now;
}

function onMouseUp(e) {
    if (isDragging && !touchMoved && Date.now() - touchStartTime < 500) {
        tryFlowerTap(e.clientX, e.clientY);
    }
    isDragging = false;
}

function onWheel(e) {
    e.preventDefault();
    cameraZoomTarget += e.deltaY * 0.001;
    cameraZoomTarget = Math.max(0.5, Math.min(2.5, cameraZoomTarget));
}

/* ============================================
   DETECCIÓN DE TAP EN FLOR
   ============================================ */
function tryFlowerTap(clientX, clientY) {
    if (!camera || floresObjects.length === 0) return;
    
    const rect = universeCanvas.getBoundingClientRect();
    pointerVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(pointerVec, camera);
    
    const hitboxes = [];
    floresObjects.forEach(flower => {
        if (flower.userData.hitbox) {
            hitboxes.push(flower.userData.hitbox);
        }
    });
    
    const intersects = raycaster.intersectObjects(hitboxes, false);
    
    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const index = hit.userData.index;
        handleFlowerTap(index);
    }
}

/* ============================================
   ACCIÓN AL TOCAR FLOR
   ============================================ */
function handleFlowerTap(index) {
    const flower = floresObjects[index];
    if (!flower) return;
    
    if (flower.userData.sprite) {
        const originalScale = flower.userData.sprite.scale.x;
        flower.userData.sprite.scale.set(originalScale * 1.4, originalScale * 1.4, 1);
        setTimeout(() => {
            flower.userData.sprite.scale.set(originalScale, originalScale, 1);
        }, 500);
    }
    if (flower.userData.glowSprite) {
        flower.userData.glowSprite.material.opacity = 1;
    }
    
    createParticleBurst(flower.position);
    
    slowMotionFactor = 0.3;
    setTimeout(() => { slowMotionFactor = 1; }, 800);
    
    showFlowerMessage(flower.userData.config);
    
    if (!flower.userData.discovered) {
        flower.userData.discovered = true;
        floresDescubiertas++;
        
        const hint = document.getElementById('discover-hint');
        if (hint) hint.classList.add('fade-out');
    }
}

function createParticleBurst(position) {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 40 : 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = position.x;
        positions[i3 + 1] = position.y;
        positions[i3 + 2] = position.z;
        velocities.push({
            x: (Math.random() - 0.5) * 0.22,
            y: (Math.random() - 0.5) * 0.22,
            z: (Math.random() - 0.5) * 0.22
        });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xf0d0ff,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    let life = 1;
    const fadeInterval = setInterval(() => {
        life -= 0.025;
        if (life <= 0) {
            clearInterval(fadeInterval);
            scene.remove(particles);
            particles.geometry.dispose();
            particles.material.dispose();
            return;
        }
        material.opacity = life;
        const pos = particles.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            pos[i3] += velocities[i].x;
            pos[i3 + 1] += velocities[i].y;
            pos[i3 + 2] += velocities[i].z;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }, 30);
}

/* ============================================
   MODAL DE FLOR
   ============================================ */
function showFlowerMessage(config) {
    const modal = document.getElementById('flower-modal');
    const modalImg = document.getElementById('modal-flower-img');
    const modalMsg = document.getElementById('modal-message');
    
    modalImg.src = `flores/${config.archivo}`;
    modalImg.onerror = () => { modalImg.style.display = 'none'; };
    modalMsg.textContent = config.mensaje;
    
    modal.classList.remove('hidden');
}

function closeFlowerMessage() {
    const modal = document.getElementById('flower-modal');
    modal.classList.add('hidden');
    const modalImg = document.getElementById('modal-flower-img');
    modalImg.style.display = 'block';
}

/* ============================================
   MENSAJE FINAL
   ============================================ */
function openFinalMessage() {
    const finalScreen = document.getElementById('final-screen');
    finalScreen.classList.remove('hidden');

    startFinalParticles();
    
    const text1 = document.getElementById('final-text-1');
    const text2 = document.getElementById('final-text-2');
    const text3 = document.getElementById('final-text-3');
    const divider = document.getElementById('final-divider');
    const signature = document.getElementById('final-signature');
    
    text1.classList.remove('hidden');
    text1.style.opacity = '1';
    text2.classList.add('hidden');
    text2.style.opacity = '0';
    text3.classList.add('hidden');
    text3.style.opacity = '0';
    divider.classList.add('hidden');
    divider.style.opacity = '0';
    signature.classList.add('hidden');
    signature.style.opacity = '0';
    
    setTimeout(() => {
        text2.classList.remove('hidden');
        text2.style.opacity = '0';
        requestAnimationFrame(() => { text2.style.opacity = '1'; });
    }, 2200);
    
    setTimeout(() => {
        divider.classList.remove('hidden');
        divider.style.opacity = '0';
        requestAnimationFrame(() => { divider.style.opacity = '1'; });
    }, 3800);
    
    setTimeout(() => {
        text3.classList.remove('hidden');
        text3.style.opacity = '0';
        requestAnimationFrame(() => { text3.style.opacity = '1'; });
    }, 4600);
    
    setTimeout(() => {
        signature.classList.remove('hidden');
        signature.style.opacity = '0';
        requestAnimationFrame(() => { signature.style.opacity = '1'; });
    }, 6200);
    
    if (heartGlow) {
        heartGlow.material.opacity = 1;
        heartGlow.scale.set(20, 20, 1);
    }
}

function closeFinalMessage() {
    const finalScreen = document.getElementById('final-screen');
    finalScreen.classList.add('hidden');
    
    if (finalAnimId) {
        cancelAnimationFrame(finalAnimId);
        finalAnimId = null;
    }
    finalParticles = [];
}

/* ============================================
   PARTÍCULAS DEL MENSAJE FINAL
   ============================================ */
function startFinalParticles() {
    finalCanvas = document.getElementById('final-canvas');
    if (!finalCanvas) return;
    finalCtx = finalCanvas.getContext('2d');
    
    resizeFinalCanvas();
    
    finalParticles = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 60 : 120;
    
    for (let i = 0; i < count; i++) {
        finalParticles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 1.8 + 0.4,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.15 - Math.random() * 0.35,
            opacity: Math.random() * 0.6 + 0.3,
            color: Math.random() > 0.7 ? '#d8a8ff' : (Math.random() > 0.5 ? '#ffffff' : '#9b5fe8'),
            twinkle: Math.random() * Math.PI * 2
        });
    }
    
    animateFinalParticles();
}

function resizeFinalCanvas() {
    if (!finalCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    finalCanvas.width = window.innerWidth * dpr;
    finalCanvas.height = window.innerHeight * dpr;
    finalCanvas.style.width = window.innerWidth + 'px';
    finalCanvas.style.height = window.innerHeight + 'px';
    finalCtx.setTransform(1, 0, 0, 1, 0, 0);
    finalCtx.scale(dpr, dpr);
}

function animateFinalParticles() {
    if (!finalCtx || !finalCanvas) return;
    finalAnimId = requestAnimationFrame(animateFinalParticles);
    
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    finalCtx.clearRect(0, 0, w, h);
    
    finalParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.04;
        
        if (p.y < -20) {
            p.y = h + 20;
            p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        
        const alpha = p.opacity * (0.5 + Math.sin(p.twinkle) * 0.5);
        
        finalCtx.beginPath();
        finalCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        finalCtx.fillStyle = p.color;
        finalCtx.globalAlpha = alpha;
        finalCtx.shadowBlur = 15;
        finalCtx.shadowColor = p.color;
        finalCtx.fill();
    });
    
    finalCtx.globalAlpha = 1;
    finalCtx.shadowBlur = 0;
}

/* ============================================
   ANIMACIÓN PRINCIPAL
   ============================================ */
function animate() {
    requestAnimationFrame(animate);
    if (!animacionActiva || !renderer) return;
    
    tiempo += 0.005 * slowMotionFactor;
    
    if (!isDragging) {
        orbitAngleY += rotationVelocity.y;
        orbitAngleX += rotationVelocity.x;
        rotationVelocity.x *= 0.94;
        rotationVelocity.y *= 0.94;
        if (Math.abs(rotationVelocity.x) < 0.0001) rotationVelocity.x = 0;
        if (Math.abs(rotationVelocity.y) < 0.0001) rotationVelocity.y = 0;
        orbitAngleX = Math.max(-1.2, Math.min(1.2, orbitAngleX));
    }
    
    const timeSinceInteraction = Date.now() - lastInteractionTime;
    if (timeSinceInteraction > 3000 && !isDragging) {
        orbitAngleY += 0.0008 * slowMotionFactor;
    }
    
    if (galaxyPoints) {
        galaxyPoints.rotation.y += 0.0006 * slowMotionFactor;
    }
    
    if (heartParticles) {
        const heartbeat = 1 + Math.sin(tiempo * 3) * 0.05;
        heartParticles.scale.set(heartbeat, heartbeat, heartbeat);
        heartParticles.rotation.y = Math.sin(tiempo * 0.5) * 0.06;
    }
    
    if (heartTextSprite) {
        const heartbeat = 1 + Math.sin(tiempo * 3) * 0.05;
        heartTextSprite.scale.set(heartbeat, heartbeat, heartbeat);
        heartTextSprite.rotation.y = Math.sin(tiempo * 0.5) * 0.06;
        heartTextSprite.material.opacity = 0.9 + Math.sin(tiempo * 3) * 0.1;
    }
    
    if (heartGlow) {
        const glowPulse = 1 + Math.sin(tiempo * 2) * 0.08;
        heartGlow.scale.set(14 * glowPulse, 14 * glowPulse, 1);
        heartGlow.material.opacity = 0.65 + Math.sin(tiempo * 2) * 0.1;
    }
    
    if (coreLightSprite) {
        const pulse = 1 + Math.sin(tiempo * 1.5) * 0.1;
        coreLightSprite.scale.set(14 * pulse, 14 * pulse, 1);
        coreLightSprite.material.opacity = 0.9 + Math.sin(tiempo * 1.5) * 0.1;
    }
    
    if (nebulaSprite) {
        nebulaSprite.material.rotation += 0.0008 * slowMotionFactor;
        nebulaSprite.material.opacity = 0.7 + Math.sin(tiempo * 0.7) * 0.15;
    }
    
    floresObjects.forEach((flower, i) => {
        const data = flower.userData;
        data.angle += data.angularSpeed * slowMotionFactor;
        
        flower.position.x = Math.cos(data.angle) * data.radius;
        flower.position.z = Math.sin(data.angle) * data.radius;
        flower.position.y = data.baseY + Math.sin(tiempo * data.floatSpeed + data.floatPhase) * 0.7;
        
        flower.rotation.y += 0.005 * slowMotionFactor;
        flower.rotation.z = Math.sin(tiempo + i) * 0.15;
        
        if (data.particles) {
            data.particles.rotation.z += 0.02 * slowMotionFactor;
            data.particles.rotation.x = Math.sin(tiempo + i) * 0.3;
        }
    });
    
    cameraZoom += (cameraZoomTarget - cameraZoom) * 0.08;
    const camRadius = 30 / cameraZoom;
    
    const camX = Math.sin(orbitAngleY) * Math.cos(orbitAngleX) * camRadius;
    const camY = Math.sin(orbitAngleX) * camRadius + 3;
    const camZ = Math.cos(orbitAngleY) * Math.cos(orbitAngleX) * camRadius;
    
    cameraCurrent.x += (camX - cameraCurrent.x) * 0.08;
    cameraCurrent.y += (camY - cameraCurrent.y) * 0.08;
    cameraCurrent.z += (camZ - cameraCurrent.z) * 0.08;
    
    camera.position.set(cameraCurrent.x, cameraCurrent.y, cameraCurrent.z);
    camera.lookAt(0, HEART_Y * 0.6, 0);
    
    renderer.render(scene, camera);
}

/* ============================================
   RESIZE
   ============================================ */
function onResize() {
    if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    if (entranceCanvas) {
        resizeEntranceCanvas();
        createEntranceParticles();
        createEntranceHeart();
        createEntranceNebula();
        createEntranceSparkles();
        createEntranceRings();
    }
    if (warpCanvas && warpActive) {
        resizeWarpCanvas();
    }
    if (finalCanvas && finalAnimId) {
        resizeFinalCanvas();
    }
}

/* ============================================
   EVENT LISTENERS
   ============================================ */
function setupEventListeners() {
    document.getElementById('enter-button').addEventListener('click', enterUniverse);
    document.getElementById('music-toggle').addEventListener('click', toggleMusic);
    document.getElementById('close-modal').addEventListener('click', closeFlowerMessage);
    document.getElementById('flower-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeFlowerMessage();
    });
    
    document.getElementById('open-final-btn').addEventListener('click', openFinalMessage);
    document.getElementById('close-final-btn').addEventListener('click', closeFinalMessage);
    
    window.addEventListener('resize', onResize);
}