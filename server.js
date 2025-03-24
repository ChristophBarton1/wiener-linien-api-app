const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Sample U-Bahn data to use when the API is unavailable
const sampleUBahnData = {
    station: "Karlsplatz",
    platforms: [
        {
            name: "U1 Platform",
            lines: [
                {
                    name: "U1",
                    towards: "Leopoldau",
                    departures: [
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 3 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 3 * 60000 + 30000).toISOString()
                            }
                        },
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 8 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 8 * 60000).toISOString()
                            }
                        },
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 13 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 13 * 60000).toISOString()
                            }
                        }
                    ]
                },
                {
                    name: "U1",
                    towards: "Oberlaa",
                    departures: [
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 5 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 5 * 60000).toISOString()
                            }
                        },
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 10 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 10 * 60000 + 120000).toISOString()
                            }
                        }
                    ]
                }
            ]
        },
        {
            name: "U2 Platform",
            lines: [
                {
                    name: "U2",
                    towards: "Seestadt",
                    departures: [
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 2 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 2 * 60000).toISOString()
                            }
                        },
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 7 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 7 * 60000).toISOString()
                            }
                        }
                    ]
                },
                {
                    name: "U2",
                    towards: "Schottentor",
                    departures: [
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 4 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 4 * 60000 + 60000).toISOString()
                            }
                        },
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 9 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 9 * 60000).toISOString()
                            }
                        }
                    ]
                }
            ]
        },
        {
            name: "U4 Platform",
            lines: [
                {
                    name: "U4",
                    towards: "Heiligenstadt",
                    departures: [
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 1 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 1 * 60000 + 45000).toISOString()
                            }
                        },
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 6 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 6 * 60000).toISOString()
                            }
                        }
                    ]
                },
                {
                    name: "U4",
                    towards: "Hütteldorf",
                    departures: [
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 3 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 3 * 60000).toISOString()
                            }
                        },
                        {
                            departureTime: {
                                timePlanned: new Date(Date.now() + 8 * 60000).toISOString(),
                                timeReal: new Date(Date.now() + 8 * 60000 + 90000).toISOString()
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

// API proxy endpoint
app.get('/api/monitor', async (req, res) => {
    try {
        const stationId = req.query.rbl;
        
        if (!stationId) {
            return res.status(400).json({ error: 'Station ID (rbl) is required' });
        }
        
        const response = await axios.get(`https://www.wienerlinien.at/ogd_realtime/monitor`, {
            params: {
                rbl: stationId
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying request to Wiener Linien API:', error.message);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return res.status(error.response.status).json({
                error: `API Error: ${error.response.status}`,
                message: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            return res.status(503).json({
                error: 'No response from Wiener Linien API',
                message: 'The API server did not respond'
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            return res.status(500).json({
                error: 'Request setup error',
                message: error.message
            });
        }
    }
});

// U-Bahn specific endpoint
app.get('/api/ubahn', async (req, res) => {
    console.log('U-Bahn API endpoint called');
    try {
        // ALWAYS use sample data for now until we debug the issue
        console.log('Using sample data for debugging');
        // Update timestamps to be current
        updateSampleDataTimestamps();
        return res.json(sampleUBahnData);
    } catch (error) {
        console.error('Error fetching U-Bahn data:', error.message);
        console.log('Falling back to sample data due to error');
        // Update timestamps to be current
        updateSampleDataTimestamps();
        res.json(sampleUBahnData);
    }
});

// Helper function to update the timestamps in the sample data
function updateSampleDataTimestamps() {
    sampleUBahnData.platforms.forEach(platform => {
        platform.lines.forEach(line => {
            line.departures.forEach((departure, index) => {
                // Create staggered departure times (1-15 minutes from now)
                const minutesOffset = (index + 1) * 5;
                // Add some random delays to some trains
                const hasDelay = Math.random() > 0.7;
                const delayMinutes = hasDelay ? Math.floor(Math.random() * 5) + 1 : 0;
                
                departure.departureTime.timePlanned = new Date(Date.now() + minutesOffset * 60000).toISOString();
                departure.departureTime.timeReal = new Date(Date.now() + minutesOffset * 60000 + delayMinutes * 60000).toISOString();
            });
        });
    });
}

// API status check endpoint
app.get('/api/status', async (req, res) => {
    try {
        const response = await axios.get('https://www.wienerlinien.at/ogd_realtime/monitor');
        res.json({ status: 'online' });
    } catch (error) {
        console.error('Error checking API status:', error.message);
        res.json({ status: 'offline' });
    }
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and navigate to http://localhost:${PORT} to test the Wiener Linien API`);
});
