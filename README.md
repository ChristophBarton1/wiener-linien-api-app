<div align="center">

# Wiener Linien API App

**A prototype for real-time Vienna public transport departures, built on the Wiener Linien Open Data API.**

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

[Live frontend](https://wiener-linien-api-app.vercel.app) · [Report an issue](https://github.com/ChristophBarton1/wiener-linien-api-app/issues)

</div>

---

## About

This is a prototype that tests how well the Wiener Linien real-time API (`ogd_realtime/monitor`) works for fetching station data, departures and delays and showing them in a simple web frontend. A small Node/Express server proxies the API so the browser can call it without running into CORS issues. There is also a Python/Flask version of the same idea. The UI is in German.

> **Note:** The Vercel deployment only serves the static frontend. The `/api/*` routes need the Node server, so run the project locally (see below) to get live data.

## Features

- **Station monitor:** look up real-time departures for any stop by its RBL number, with preset test stations (Stephansplatz, Karlsplatz, Praterstern).
- **API proxy:** an Express endpoint (`/api/monitor?rbl=…`) forwards requests to Wiener Linien and passes upstream errors through as readable messages.
- **Status check:** shows whether the Wiener Linien API is currently reachable.
- **Raw data view:** displays the full JSON response, which helps when exploring the API structure.
- **U-Bahn tracker (`ubahn.html`):** a departure board for Karlsplatz (U1/U2/U4) that marks delays (planned vs. real time) and can refresh itself every 30 seconds. It **currently runs on generated sample data**.
- **Python alternative:** a Flask app (`app.py`) with a reusable API client (`api_client.py`) and a command-line tester (`test_api.py`).

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | HTML, CSS, vanilla JavaScript (Fetch API) |
| Backend (Node) | Node.js, Express, Axios, CORS |
| Backend (Python) | Flask, Requests |
| Data | [Wiener Linien Open Government Data, real-time monitor](https://www.wienerlinien.at/open-data) |

## Run locally

**Node / Express (main version)**

```bash
npm install
npm start
# → http://localhost:3000            (station monitor)
# → http://localhost:3000/ubahn.html (U-Bahn tracker)
```

**Python / Flask**

```bash
pip install -r requirements.txt
python app.py        # → http://localhost:5000
python test_api.py   # command-line API test
```

## Project structure

```
├── server.js          # Express server + API proxy
├── index.html         # Station monitor frontend
├── ubahn.html         # U-Bahn departure board (sample data)
├── ubahn-test.html    # Experimental variant of the U-Bahn board
├── app.py             # Flask app
├── api_client.py      # Python client for the Wiener Linien API
├── test_api.py        # CLI test script
└── templates/         # Flask templates
```

---

<div align="center">

Built by [Christoph Barton](https://christophbarton.com)

</div>
