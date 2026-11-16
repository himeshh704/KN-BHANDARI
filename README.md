# K. N. Bhandari — Digital Legacy & Retrospective

A cinematic, high-editorial legacy archive website honoring **Mr. Kailash Nath Bhandari**, former Chairman & Managing Director of The New India Assurance, United India Insurance, and Chairman of the General Insurance Corporation of India (GIC Re).

## 🏛️ Website Overview

The website is an award-winning digital editorial experience featuring:
- **Homepage (`index.html`)**: Editorial hero, archival photo collage, key milestones, stats, philosophy, and interactive timeline.
- **Biographical Journey (`journey.html`)**: From Jodhpur heritage to national corporate governance leadership.
- **Leadership Dossier (`leadership.html`)**: Landmark achievements across Indian general insurance and global reinsurance.
- **Corporate Governance (`governance.html`)**: Board stewardship, audit committees, and ethical leadership pillars.
- **Institutional Contributions (`contributions.html`)**: Transforming national institutions and economic resilience.
- **Pedagogy & Thought Leadership (`pedagogy.html`)**: Academic lectures, speeches, mentorship, and publications.
- **Jodhpur Roots (`jodhpur.html`)**: Connection to Marwar heritage, philanthropic foundations, and community.
- **Archival Documents & Speeches (`archive.html` & `insights.html`)**: Curated historical papers and insights.
- **Contact & Inquiries (`contact.html`)**: Institutional communication and archival access.

---

## 🎨 Design System & Aesthetics
- **Color Palette**: Deep Royal Burgundy (`#58111A`, `#380A10`, `#1A0407`), Warm Heritage Parchment (`#FAF7F2`, `#F3ECE1`), Gold/Champagne accents (`#C5A059`), Crisp Editorial Ivory (`#FFFFFF`).
- **Typography**: Playfair Display (Serif) + Inter (Sans-serif) + Cormorant Garamond.
- **Motion**: GSAP ScrollTrigger, subtle parallax, editorial reveals.

---

## 🧩 React / Shadcn UI Component Integration
Located in `/components/ui/scroll-gallery.tsx`:
- **ScrollGallery**: High-performance GSAP ScrollTrigger image gallery with strip-mask wipe transitions and zoom mechanics.
- **Zero made-up picture labels**: Fully supports anonymous, unlabelled, or index-based image layers without fabricating titles.
- **Shadcn Compatible**: Uses standard `@/lib/utils` (`cn`) and modular architecture.

### Running Locally
To preview the website locally:
```bash
# Run local HTTP server
npx serve .
# Or using Python:
python -m http.server 4100
```
Visit [http://localhost:4100](http://localhost:4100).
