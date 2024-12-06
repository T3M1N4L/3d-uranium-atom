const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#1e1e2e");
document.body.appendChild(renderer.domElement);

const colors = {
    base: "#89b4fa",
    highlight: "#f38ba8",
    glow: "#94e2d5"
};

const nucleusGroup = new THREE.Group();
const protonMaterial = new THREE.MeshStandardMaterial({ color: colors.highlight, emissive: colors.highlight });
const neutronMaterial = new THREE.MeshStandardMaterial({ color: colors.base, emissive: colors.base });

for (let i = 0; i < 92; i++) {
    const proton = new THREE.Mesh(new THREE.SphereGeometry(0.2304, 16, 16), protonMaterial);
    proton.position.set(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
    ).multiplyScalar(1.728);
    nucleusGroup.add(proton);
}

for (let i = 0; i < 146; i++) {
    const neutron = new THREE.Mesh(new THREE.SphereGeometry(0.2304, 16, 16), neutronMaterial);
    neutron.position.set(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
    ).multiplyScalar(1.728);
    nucleusGroup.add(neutron);
}

scene.add(nucleusGroup);

const particleCount = 3000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const radius = 8.64 + Math.random() * 2.88;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    color: colors.glow,
    size: 0.0864,
    transparent: true,
    opacity: 0.9
});

const electronCloud = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(electronCloud);

const shellRadii = [5.76, 11.52, 17.28, 23.04, 28.8, 34.56, 39.36];

function createElectronCloud(radius, particleCount) {
    const cloudGeometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(1 - 2 * Math.random());
        const r = radius * Math.pow(Math.random(), 1 / 3);

        positions.push(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
    }

    cloudGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return new THREE.Points(cloudGeometry, particlesMaterial);
}

const electronShells = [2, 8, 18, 32, 21, 9, 4];
const electronClouds = electronShells.map((electrons, index) => {
    const particleCount = (index === 6) ? 100 : 500; 
    const cloud = createElectronCloud(shellRadii[index], particleCount);
    scene.add(cloud);
    return cloud;
});

const ringMaterial = new THREE.LineBasicMaterial({
    color: '#cdd6f4',
    transparent: true,
    opacity: 0.3
});

const orbitalRings = shellRadii.map(radius => {
    const ringGeometry = new THREE.RingGeometry(radius, radius + 0.1, 64);
    const ring = new THREE.LineSegments(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    return ring;
});

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

camera.position.z = 14.4;

const controls = {
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0
};

document.addEventListener('mousemove', (event) => {
    controls.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    controls.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

function animate() {
    requestAnimationFrame(animate);
    nucleusGroup.rotation.x += 0.01;
    nucleusGroup.rotation.y += 0.01;
    electronCloud.rotation.y += 0.002;
    electronClouds.forEach((cloud, index) => {
        cloud.rotation.x += (index === 6 ? 0.001 : 0.002) * (index + 1); 
        cloud.rotation.y += (index === 6 ? 0.0005 : 0.001) * (index + 1); 
    });
    orbitalRings.forEach((ring) => {
        ring.rotation.z += 0.01;
    });
    controls.targetX += (controls.mouseX - controls.targetX) * 0.05;
    controls.targetY += (controls.mouseY - controls.targetY) * 0.05;
    camera.position.x = controls.targetX * 10;
    camera.position.y = controls.targetY * 10;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

animate();