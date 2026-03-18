// ===== 1. BASIC SETUP =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky Blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== 2. LIGHTING =====
// Using a very bright Ambient Light so everything is visible regardless of direction
const light = new THREE.AmbientLight(0xffffff, 1.5); 
scene.add(light);

// ===== 3. FOOLPROOF TERRAIN =====
const geometry = new THREE.BoxGeometry(1, 1, 1);
const grassMat = new THREE.MeshBasicMaterial({ color: 0x55aa33 });
const stoneMat = new THREE.MeshBasicMaterial({ color: 0x808080 });

// A HUGE floor (40x40) so you can't miss it
for (let x = -20; x < 20; x++) {
    for (let z = -20; z < 20; z++) {
        const mesh = new THREE.Mesh(geometry, grassMat);
        mesh.position.set(x, 0, z);
        scene.add(mesh);
    }
}

// A TEST PILLAR (so you have something to look at immediately)
for (let y = 1; y < 5; y++) {
    const pillar = new THREE.Mesh(geometry, stoneMat);
    pillar.position.set(0, y, -5); // 5 blocks in front of start
    scene.add(pillar);
}

// ADD A GRID (This helps you see perspective/ground)
const grid = new THREE.GridHelper(100, 100, 0xffffff, 0xbbbbbb);
grid.position.y = 0.51; // Slightly above the blocks
scene.add(grid);

// ===== 4. CONTROLS =====
const controls = new THREE.PointerLockControls(camera, document.body);

// Set player starting position: x=0, y=2 (height), z=5 (back a bit)
controls.getObject().position.set(0, 2, 5);
scene.add(controls.getObject());

document.body.addEventListener('click', () => {
    controls.lock();
});

// ===== 5. MOVEMENT =====
const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked) {
        // Simple movement
        if (keys['KeyW']) controls.moveForward(0.15);
        if (keys['KeyS']) controls.moveForward(-0.15);
        if (keys['KeyA']) controls.moveRight(-0.15);
        if (keys['KeyD']) controls.moveRight(0.15);
    }

    renderer.render(scene, camera);
}
animate();

// ===== 6. RESIZE =====
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});