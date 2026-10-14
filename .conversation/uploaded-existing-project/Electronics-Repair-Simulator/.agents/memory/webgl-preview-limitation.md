---
name: 3D preview limitation
description: The app preview screenshot browser in this project environment cannot create a WebGL context.
---

This environment's screenshot browser reports `THREE.WebGLRenderer: Error creating WebGL context` when entering the 3D workshop. The app now checks for a usable context and renders a fallback illustration when unavailable.

**Why:** Screenshot-based inspection cannot validate the GPU-rendered scene in this environment, and without a fallback the preview showed a Vite error overlay.

**How to apply:** For future 3D workshop changes, use the screenshot to verify the fallback and mobile layout, but state clearly that the live WebGL scene was not visually verified by the screenshot browser.
