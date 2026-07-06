const fs = require('fs');
const config = require('./config');

const cssContent = fs.readFileSync('./hero.css', 'utf8');

// SVG Dimensions
const W = 1600;
const H = 550;

// Generate Grid
let gridLines = '';
for (let i = 0; i <= W; i += 40) {
    gridLines += `<line x1="${i}" y1="0" x2="${i}" y2="${H}" stroke="rgba(255,255,255,0.03)" stroke-width="1" />`;
}
for (let i = -40; i <= H + 40; i += 40) {
    gridLines += `<line x1="0" y1="${i}" x2="${W}" y2="${i}" stroke="rgba(255,255,255,0.03)" stroke-width="1" />`;
}

// Generate Particles
let particles = '';
for (let i = 0; i < 40; i++) {
    const x = Math.random() * W;
    const delay = Math.random() * 15;
    const duration = 10 + Math.random() * 15;
    const r = 1 + Math.random() * 2.5;
    const color = Math.random() > 0.5 ? config.colors.primary : config.colors.accent;
    particles += `<circle cx="${x}" cy="0" r="${r}" fill="${color}" class="float-up" style="animation-duration: ${duration}s; animation-delay: -${delay}s;" />`;
}

// Generate Neural Network (Right Side)
const nodes = [];
for (let i = 0; i < 20; i++) {
    nodes.push({
        x: 800 + Math.random() * 700,
        y: 50 + Math.random() * 450
    });
}
let network = '';
for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < 150) {
            network += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="${config.colors.secondary}" stroke-width="1" opacity="0.2">
                <animate attributeName="opacity" values="0.1;0.4;0.1" dur="${2 + Math.random() * 4}s" repeatCount="indefinite" begin="-${Math.random() * 5}s" />
            </line>`;
        }
    }
}
for (const node of nodes) {
    network += `<circle cx="${node.x}" cy="${node.y}" r="2.5" fill="${config.colors.primary}" opacity="0.6">
        <animate attributeName="r" values="2;4;2" dur="${2 + Math.random() * 2}s" repeatCount="indefinite" begin="-${Math.random() * 5}s" />
    </circle>`;
}

// Draw Buttons
const iconDefs = {
    github: '<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
    linkedin: '<path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
    kaggle: '<path fill="currentColor" d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.089-1.448 1.374v4.71c0 .165-.076.254-.235.254H5.143c-.153 0-.235-.089-.235-.254V.141c0-.153.082-.235.235-.235H7.72c.159 0 .235.082.235.235v15.223l5.885-6.206c.105-.105.241-.165.41-.165H17.55c.176 0 .264.06.27.171.012.065-.018.123-.082.188L11.3 15.688l7.461 7.971c.07.059.094.129.064.2z"/>',
    globe: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="2" y1="12" x2="22" y2="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    file: '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="13 2 13 9 20 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
};

let buttonsHtml = '';
config.buttons.forEach((btn, idx) => {
    const x = 100 + (idx * 130);
    const y = 350;
    const hasIcon = btn.icon && iconDefs[btn.icon];
    const textX = hasIcon ? 65 : 55;
    
    let iconSvg = '';
    if (hasIcon) {
        iconSvg = `<svg width="14" height="14" x="15" y="13" viewBox="0 0 24 24" color="#E2E8F0">${iconDefs[btn.icon]}</svg>`;
    }
    
    buttonsHtml += `
    <g transform="translate(${x}, ${y})">
        <rect width="110" height="40" class="btn-bg" />
        ${iconSvg}
        <text x="${textX}" y="25" text-anchor="middle" class="btn-text">${btn.label}</text>
    </g>
    `;
});

// Line Chart Card (Top Left of Dashboard)
const chartPoints = [[0, 90], [50, 60], [100, 80], [150, 30], [200, 50], [250, 10], [300, 40], [330, 0]];
let chartPath = `M 880 200 `; // Offset + 880, 200
let rawPath = `M 0 90 `;
for (let i = 1; i < chartPoints.length; i++) {
    const cx = (chartPoints[i-1][0] + chartPoints[i][0]) / 2;
    rawPath += `C ${cx} ${chartPoints[i-1][1]}, ${cx} ${chartPoints[i][1]}, ${chartPoints[i][0]} ${chartPoints[i][1]} `;
}
const lineChartHtml = `
    <rect x="850" y="80" width="380" height="180" class="card-bg" />
    <text x="880" y="115" class="kpi-title">Model Loss Curve</text>
    <g transform="translate(880, 130)">
        <!-- Grid lines -->
        <line x1="0" y1="25" x2="330" y2="25" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
        <line x1="0" y1="50" x2="330" y2="50" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
        <line x1="0" y1="75" x2="330" y2="75" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
        
        <!-- Gradient fill under line -->
        <path d="${rawPath} L 330 110 L 0 110 Z" fill="url(#chart-fill)" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="4s" repeatCount="indefinite" />
        </path>
        
        <!-- Animated Line -->
        <path d="${rawPath}" fill="none" stroke="${config.colors.primary}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="draw-line" />
        
        <!-- Moving dot -->
        <circle cx="0" cy="0" r="5" fill="${config.colors.text}" filter="url(#glow)">
            <animateMotion path="${rawPath}" dur="6s" repeatCount="indefinite" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
        </circle>
    </g>
`;

// CPU Usage KPI Card (Top Right)
const circum = 2 * Math.PI * 45;
const cpuOffset = circum - (config.stats.cpu / 100) * circum;
const cpuCardHtml = `
    <rect x="1250" y="80" width="220" height="180" class="card-bg" />
    <text x="1360" y="115" text-anchor="middle" class="kpi-title">Avg CPU Load</text>
    <g transform="translate(1360, 185) rotate(-90)">
        <circle cx="0" cy="0" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8" />
        <circle cx="0" cy="0" r="45" fill="none" stroke="${config.colors.accent}" stroke-width="8" stroke-dasharray="${circum}" stroke-dashoffset="${circum}" class="draw-circle" stroke-linecap="round" style="--target-offset: ${cpuOffset};" />
    </g>
    <text x="1360" y="195" text-anchor="middle" class="kpi-value">${config.stats.cpu}%</text>
`;

// Model Accuracy KPI Card (Bottom Right)
const accOffset = circum - (config.stats.accuracy / 100) * circum;
const accCardHtml = `
    <rect x="1250" y="280" width="220" height="180" class="card-bg" />
    <text x="1360" y="315" text-anchor="middle" class="kpi-title">Model Accuracy</text>
    <g transform="translate(1360, 385) rotate(-90)">
        <circle cx="0" cy="0" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8" />
        <circle cx="0" cy="0" r="45" fill="none" stroke="${config.colors.primary}" stroke-width="8" stroke-dasharray="${circum}" stroke-dashoffset="${circum}" class="draw-circle" stroke-linecap="round" style="--target-offset: ${accOffset};" />
    </g>
    <text x="1360" y="395" text-anchor="middle" class="kpi-value">${config.stats.accuracy}%</text>
`;

// Bar Chart Card (Bottom Left)
const bars = [30, 70, 45, 90, 60, 100, 85, 50];
let barHtml = '';
bars.forEach((val, idx) => {
    const x = 30 + (idx * 40);
    const h = (val / 100) * 90;
    const y = 120 - h;
    barHtml += `
    <rect x="${x}" y="120" width="22" height="0" fill="url(#bar-gradient)" rx="4">
        <animate attributeName="height" from="0" to="${h}" dur="1s" begin="${idx * 0.1}s" fill="freeze" />
        <animate attributeName="y" from="120" to="${y}" dur="1s" begin="${idx * 0.1}s" fill="freeze" />
    </rect>
    <text x="${x + 11}" y="140" text-anchor="middle" fill="#94A3B8" font-size="10" font-family="Inter">D${idx+1}</text>
    `;
});
const barChartHtml = `
    <rect x="850" y="280" width="380" height="180" class="card-bg" />
    <text x="880" y="315" class="kpi-title">Weekly Commits / Activity</text>
    <g transform="translate(850, 305)">
        ${barHtml}
    </g>
`;

// SVG Skeleton
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <defs>
        <style>
            ${cssContent}
            @keyframes typeName {
                from { width: 0; }
                to { width: ${config.name.length * 52 + 10}px; }
            }
            .type-rect {
                animation: typeName 1.5s steps(${config.name.length}, end) forwards;
            }
            @keyframes typeCursor {
                from { transform: translateX(0); }
                to { transform: translateX(${config.name.length * 52 + 10}px); }
            }
            .cursor {
                animation: typeCursor 1.5s steps(${config.name.length}, end) forwards, cursorBlink 1s infinite;
            }
            @keyframes cursorBlink {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }
        </style>
        
        <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="${config.colors.muted}" />
        </linearGradient>
        
        <linearGradient id="chart-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${config.colors.primary}" stop-opacity="0.5" />
            <stop offset="100%" stop-color="${config.colors.primary}" stop-opacity="0" />
        </linearGradient>

        <linearGradient id="bar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${config.colors.secondary}" />
            <stop offset="100%" stop-color="${config.colors.secondary}" stop-opacity="0.3" />
        </linearGradient>

        <radialGradient id="glow-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${config.colors.primary}" stop-opacity="0.15" />
            <stop offset="100%" stop-color="${config.colors.background}" stop-opacity="0" />
        </radialGradient>
        
        <radialGradient id="glow-bg-2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${config.colors.secondary}" stop-opacity="0.1" />
            <stop offset="100%" stop-color="${config.colors.background}" stop-opacity="0" />
        </radialGradient>

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        
        <clipPath id="grid-clip">
            <rect x="0" y="0" width="${W}" height="${H}" />
        </clipPath>
    </defs>

    <!-- Background Layer -->
    <rect width="${W}" height="${H}" fill="${config.colors.background}" />
    
    <!-- Glows -->
    <circle cx="200" cy="200" r="400" fill="url(#glow-bg)" class="breathe" />
    <circle cx="1200" cy="300" r="500" fill="url(#glow-bg-2)" class="breathe" style="animation-delay: -4s;" />
    
    <!-- Animated Grid -->
    <g clip-path="url(#grid-clip)">
        <g class="animated-grid">
            ${gridLines}
        </g>
    </g>

    <!-- Neural Network -->
    <g>
        ${network}
    </g>

    <!-- Particles -->
    <g>
        ${particles}
    </g>

    <!-- Dashboard Layer -->
    <g>
        ${lineChartHtml}
        ${cpuCardHtml}
        ${accCardHtml}
        ${barChartHtml}
    </g>

    <!-- Text Layer (Left Side) -->
    <g transform="translate(100, 160)">
        <clipPath id="typing-clip">
            <rect x="0" y="-72" width="0" height="100" class="type-rect" />
        </clipPath>
        <g clip-path="url(#typing-clip)">
            <text x="0" y="0" class="title">${config.name}</text>
        </g>
        <text x="5" y="0" class="title cursor" fill="${config.colors.primary}">_</text>
        <text x="5" y="45" class="subtitle">> ${config.subtitle1}</text>
        <text x="5" y="75" class="subtitle" opacity="0.8">> ${config.subtitle2}</text>
        <text x="5" y="105" class="subtitle" opacity="0.6">> ${config.subtitle3}</text>
        <text x="5" y="155" class="tagline">${config.tagline}</text>
    </g>

    <!-- Buttons -->
    <g>
        ${buttonsHtml}
    </g>

</svg>
`;

fs.writeFileSync('./hero.svg', svg.trim());
console.log('Premium SVG generated successfully: hero.svg');
