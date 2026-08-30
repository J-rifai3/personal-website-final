# Personal Website

Single-page portfolio site for a Georgia Tech CS + MechE robotics student.

**Project path:** `~/Documents/github-repos/personal-website`

## Preview locally

```bash
cd ~/Documents/github-repos/personal-website
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Where to put images

```
assets/images/
├── profile.svg          ← replace with your headshot (e.g. profile.jpg)
├── project-rover.svg    ← one image per project card
└── ...
```

Update matching `src="assets/images/..."` paths in `index.html` if you change filenames.

## Where to put your resume

```
assets/resume/resume.pdf
```

The header **Download Resume** link points to that file.

## Customize

1. **Name & bio** — Edit `index.html` (hero, about, footer).
2. **Projects** — Update titles, descriptions, and GitHub links on each `.project-card`.
3. **Contact** — Update email, GitHub, and LinkedIn in the footer.
4. **Colors** — Tweak CSS variables at the top of `styles.css`.

## Deploy

Static files only — deploy to GitHub Pages, Netlify, Vercel, or any static host.
