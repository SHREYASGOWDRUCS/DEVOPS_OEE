const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// ========== REQUEST COUNTING MIDDLEWARE ==========
// This middleware counts every incoming request to track traffic levels
let requestCount = 0;

app.use((req, res, next) => {
    // Increment request counter on every request
    requestCount++;
    console.log(`Request #${requestCount}: ${req.method} ${req.path}`);
    next();
});

// ========== TRAFFIC DETERMINATION FUNCTION ==========
// Determines traffic level based on request count
// LOW: < 50 requests
// HIGH: >= 50 requests
function getTrafficLevel() {
    if (requestCount < 50) {
        return 'LOW';
    } else {
        return 'HIGH';
    }
}

// ========== DEPLOYMENT STRATEGY SELECTION ==========
// Selects deployment strategy based on traffic level
// LOW traffic → Rolling Deployment (safer, gradual updates)
// HIGH traffic → Blue-Green Deployment (zero-downtime switching)
function getDeploymentStrategy() {
    const traffic = getTrafficLevel();
    if (traffic === 'LOW') {
        return 'Rolling Deployment';
    } else {
        return 'Blue-Green Deployment';
    }
}

// ========== SERVE STATIC FILES ==========
app.use(express.static(path.join(__dirname, 'public')));

// ========== HOMEPAGE ROUTE ==========
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== TRAFFIC ENDPOINT ==========
// Returns current request count and traffic level
// Used by frontend to display real-time traffic information
app.get('/api/traffic', (req, res) => {
    res.json({
        requests: requestCount,
        traffic: getTrafficLevel(),
        deployment: getDeploymentStrategy()
    });
});

// ========== RESET TRAFFIC ENDPOINT ==========
// Resets request counter to zero
app.get('/api/reset-traffic', (req, res) => {
    requestCount = 0;
    console.log('Traffic counter reset to 0');
    res.json({
        message: 'Traffic reset successfully',
        requests: requestCount,
        traffic: getTrafficLevel(),
        deployment: getDeploymentStrategy()
    });
});

// ========== HEALTH CHECK ENDPOINT ==========
app.get('/health', (req, res) => {
    res.send('OK');
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Traffic Simulation: Generate 100 requests to trigger HIGH traffic alert`);
    console.log(`🔄 Rolling Deployment for LOW traffic, Blue-Green for HIGH traffic`);
});