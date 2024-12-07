// Initiate a grand visual realm using Three.js
const cosmicStage = new THREE.Scene();
const opticalLens = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const visualSynthesizer = new THREE.WebGLRenderer({ antialias: true });
visualSynthesizer.setSize(window.innerWidth, window.innerHeight);
visualSynthesizer.setClearColor("#1e1e2e");
document.body.appendChild(visualSynthesizer.domElement);

// Atomic structure parameters (protons, neutrons, electrons)
const atomicBlueprint = {
    protons: 92,   // Example: Uranium, can be modified
    neutrons: 146, // Adjust as necessary
    electrons: 92  // Neutral atom condition: protons = electrons
};

const colorPalette = {
    primary: "#89b4fa",
    accent: "#f38ba8",
    luminescence: "#94e2d5"
};

// Create a nucleus assembly
const atomicNucleus = new THREE.Group();
const protonMaterial = new THREE.MeshStandardMaterial({ color: colorPalette.accent, emissive: colorPalette.accent });
const neutronMaterial = new THREE.MeshStandardMaterial({ color: colorPalette.primary, emissive: colorPalette.primary });

// Populate the nucleus with protons
for (let protonIndex = 0; protonIndex < atomicBlueprint.protons; protonIndex++) {
    const protonSphere = new THREE.Mesh(new THREE.SphereGeometry(0.2304, 16, 16), protonMaterial);
    protonSphere.position.set(
        (Math.random() - 0.5) * 1.728,
        (Math.random() - 0.5) * 1.728,
        (Math.random() - 0.5) * 1.728
    );
    atomicNucleus.add(protonSphere);
}

// Populate the nucleus with neutrons
for (let neutronIndex = 0; neutronIndex < atomicBlueprint.neutrons; neutronIndex++) {
    const neutronSphere = new THREE.Mesh(new THREE.SphereGeometry(0.2304, 16, 16), neutronMaterial);
    neutronSphere.position.set(
        (Math.random() - 0.5) * 1.728,
        (Math.random() - 0.5) * 1.728,
        (Math.random() - 0.5) * 1.728
    );
    atomicNucleus.add(neutronSphere);
}

cosmicStage.add(atomicNucleus);

// Electron cloud particle system
const totalParticles = 3000;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(totalParticles * 3);

for (let particleIndex = 0; particleIndex < totalParticles; particleIndex++) {
    const radialDistance = 8.64 + Math.random() * 2.88;
    const azimuthalAngle = Math.random() * 2 * Math.PI;
    const polarAngle = Math.acos(2 * Math.random() - 1);

    const xCoord = radialDistance * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
    const yCoord = radialDistance * Math.sin(polarAngle) * Math.sin(azimuthalAngle);
    const zCoord = radialDistance * Math.cos(polarAngle);

    particlePositions[particleIndex * 3] = xCoord;
    particlePositions[particleIndex * 3 + 1] = yCoord;
    particlePositions[particleIndex * 3 + 2] = zCoord;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: colorPalette.luminescence,
    size: 0.0864,
    transparent: true,
    opacity: 0.9
});

const electronCloudFormation = new THREE.Points(particleGeometry, particleMaterial);
cosmicStage.add(electronCloudFormation);

// Define radii for electron shells
const electronShellDistances = [5.76, 11.52, 17.28, 23.04, 28.8, 34.56, 39.36];

function generateElectronCloud(radius, numParticles) {
    const cloudGeometry = new THREE.BufferGeometry();
    const cloudPositions = [];

    for (let particleIndex = 0; particleIndex < numParticles; particleIndex++) {
        const azimuthalAngle = Math.random() * Math.PI * 2;
        const polarAngle = Math.acos(1 - 2 * Math.random());
        const adjustedRadius = radius * Math.pow(Math.random(), 1 / 3 );

        cloudPositions.push(
            adjustedRadius * Math.sin(polarAngle) * Math.cos(azimuthalAngle),
            adjustedRadius * Math.sin(polarAngle) * Math.sin(azimuthalAngle),
            adjustedRadius * Math.cos(polarAngle)
        );
    }

    cloudGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cloudPositions, 3));
    return new THREE.Points(cloudGeometry, particleMaterial);
}

// Configuration for electron shells (number of electrons per shell)
const electronShellConfigurations = [2, 8, 18, 32, 21, 9, 4];
const electronCloudsArray = electronShellConfigurations.map((electronCount, shellIndex) => {
    const particleCount = (shellIndex === 6) ? 100 : 500;  // Customize particle count
    const cloudFormation = generateElectronCloud(electronShellDistances[shellIndex], particleCount);
    cosmicStage.add(cloudFormation);
    return cloudFormation;
});

// Create orbital rings
const orbitalRingMaterial = new THREE.LineBasicMaterial({
    color: '#cdd6f4',
    transparent: true,
    opacity: 0.3
});

const orbitalRingsArray = electronShellDistances.map(radius => {
    const ringGeometry = new THREE.RingGeometry(radius, radius + 0.1, 64);
    const orbitalRing = new THREE.LineSegments(ringGeometry, orbitalRingMaterial);
    orbitalRing.rotation.x = Math.PI / 2;
    cosmicStage.add(orbitalRing);
    return orbitalRing;
});

// Lighting setup
const ambientLightSource = new THREE.AmbientLight(0x404040);
cosmicStage.add(ambientLightSource);

const directionalLightSource = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLightSource.position.set(1, 1, 1);
cosmicStage.add(directionalLightSource);

// Position the camera
opticalLens.position.z = 14.4;

const controlParameters = {
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0
};

document.addEventListener('mousemove', (event) => {
    controlParameters.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    controlParameters.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Animation loop for rendering
function renderAnimation() {
    requestAnimationFrame(renderAnimation);
    atomicNucleus.rotation.x += 0.01;
    atomicNucleus.rotation.y += 0.01;
    electronCloudFormation.rotation.y += 0.002;

    electronCloudsArray.forEach((cloud, index) => {
        cloud.rotation.x += (index === 6 ? 0.001 : 0.002) * (index + 1); 
        cloud.rotation.y += (index === 6 ? 0.0005 : 0.001) * (index + 1); 
    });

    orbitalRingsArray.forEach((ring) => {
        ring.rotation.z += 0.01;
    });

    controlParameters.targetX += (controlParameters.mouseX - controlParameters.targetX) * 0.05;
    controlParameters.targetY += (controlParameters.mouseY - controlParameters.targetY) * 0.05;
    opticalLens.position.x = controlParameters.targetX * 10;
    opticalLens.position.y = controlParameters.targetY * 10;
    opticalLens.lookAt(0, 0, 0);
    visualSynthesizer.render(cosmicStage, opticalLens);
}

renderAnimation(); 