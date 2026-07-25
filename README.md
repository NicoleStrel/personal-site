# personal-site

Nicole Streltsov's personal site — current ASCII site plus a 2022 archive.

## Structure

- `site/` — new Vite + React + TypeScript site (primary, served at `/`)
- `site-2022/` — frozen 2022 CRA site (served at `/past/2022`)
- `shared/data/` — shared CSVs (`experience.csv`, `projects.csv`, `indiehacking.csv`)
- `shared/img/` — shared images (synced into `site/public/img` on build)

## Scripts

From the repo root:

```bash
npm run dev           # sync data + develop the new site
npm run archive:build # build 2022 archive into site/public/past/2022
npm run build         # archive + new site production build
npm run preview       # preview the new site build
```

Edit content in `shared/data/`. Run `npm run sync:data` (or any of the scripts above) to copy CSVs/images into both apps.

## Indie hacking CSV

`shared/data/indiehacking.csv` columns:

`slug,title,one_liner,status,started,ended,img,description,url,github,tech,highlight`

- `status`: `building` | `live` | `sunset`
- `description` bullets separated by `--`
- `tech` items separated by `;`
- images go in `shared/img/indiehacking/`
