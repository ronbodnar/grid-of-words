<p align="center">
   <a href="https://play.ronbodnar.com" target="_blank">
      <img src="src/public/assets/images/grid-of-words.svg" width="120" alt="Grid of Words Logo" />
   </a>
</p>

<h1 align="center">Grid of Words</h1>

<p align="center">
  A high-performance, dictionary-driven word puzzle game.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v20-green" />
  <img src="https://img.shields.io/badge/Frontend-Vanilla_JS-yellow" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248" />
  <img src="https://img.shields.io/badge/Security-JWT_Auth-critical" />
  <img src="https://img.shields.io/badge/Dictionary-400k+_Words-blue" />
</p>

**Grid of Words** is a sophisticated word-puzzle platform built on a custom Vanilla JavaScript SPA engine. It features a massive 400,000+ word dictionary, multi-language support, and a robust backend architecture focused on security and performance.

<br />

<p align="center">
  <a href="https://play.ronbodnar.com" target="_blank">
    <img src="https://img.shields.io/badge/Launch_Live_Game-2ea44f?style=for-the-badge" alt="Launch Game" />
  </a>
</p>

## 📍 Table of Contents

- [🧠 Technical Features](#features)
- [🏗️ System Architecture](#architecture)
- [📊 Data Engineering](#data)
- [🚦 Getting Started](#getting-started)
- [🐳 Docker Deployment](#docker)
- [🧩 Showcase OS Integration](#integration)

<br />

<a name="features"></a>

## 🧠 Technical Features

- **Custom SPA Engine**: Built with Vanilla JS to demonstrate deep DOM manipulation knowledge and state management without framework overhead.
- **Stateless Authentication**: JWT-based flows using **HttpOnly & Secure cookies** to mitigate XSS and CSRF vulnerabilities.
- **Linguistic Scale**: Integration of a custom-scraped Oxford English Dictionary (OED) dataset containing over 439,000 entries.
- **Bilingual Core**: Dynamically switchable dictionary adapters supporting both English and Spanish lexicons.
- **Security-First Recovery**: Industry-standard password reset workflows using short-lived, cryptographically secure tokens.
- **Telemetry & Logging**: Centralized error tracking and system health monitoring via the Winston logging framework.

<br />

<a name="architecture"></a>

## 🏗️ System Architecture

### Frontend Architecture

The client-side is architected as a set of decoupled modules:

- **Game Controller**: Manages the matching algorithm for guess evaluation.
- **UI Renderer**: Handles dynamic CSS transitions and Chart.js integration for player statistics.
- **Session Manager**: Interface for JWT lifecycle management and persistent user state.

### Backend Architecture

Built with **Node.js & Express**, following a service-oriented pattern:

- **Auth Service**: Handles BCrypt password hashing and JWT issuance.
- **Dictionary Service**: Optimized MongoDB aggregations for rapid word retrieval.
- **Middleware Layer**: Enforces rate-limiting and authentication guards on sensitive routes.

<br />

<a name="data"></a>

## 📊 Data Engineering (The OED Parser)

A significant portion of this project involved the creation of a custom ETL (Extract, Transform, Load) pipeline to build the game's backbone:

1. **Extraction**: A Python-based scraper designed to navigate the Oxford English Dictionary.
2. **Transformation**: Logic to handle "Bad Gateway" retries, deduplication, and Part-of-Speech (PoS) tagging.
3. **Loading**: Data normalized into JSON, CSV, and MySQL formats for cross-platform compatibility.

<br />

<a name="getting-started"></a>

## 🚦 Getting Started

### Installation

```bash
git clone https://github.com/ronbodnar/grid-of-words.git
cd grid-of-words
npm install
```

Run

```bash
# Development mode
npm run dev

# Production mode
npm run prod
```

<br />

<a name="docker"></a>

## 🐳 Docker Deployment

The application is containerized for consistent deployment across environments.

```bash
# Build and launch the container suite
docker-compose up --build
```

The stack includes the Node application and a MongoDB instance pre-configured for internal network communication.

<br />

<a name="integration"></a>

## 🧩 Showcase OS Integration

Grid of Words is fully compatible with Showcase OS. When launched within the OS, it behaves as a native application:

- Process Management: Can be launched, minimized, and terminated via the OS Process Service.

- Responsive Shell: Adapts its layout dynamically for the Showcase OS Mobile and Desktop environments.

<br />

<a name="connect"></a>

## 📫 Connect

**Created by Ron Bodnar**

- LinkedIn: https://linkedin.com/in/ronbodnar
- Email: ron.bodnar@outlook.com

<br />

<a name="license"></a>

## ⚖️ License

Distributed under the MIT License. See LICENSE for more information.
