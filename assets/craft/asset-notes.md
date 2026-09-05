# Handmade craft assets

All visual assets were created with the built-in GPT image-generation workflow. They contain only paper/craft imagery: no people, faces, text, symbols, logos, or watermarks.

| Asset | Source → final dimensions | Transparency | Optimisation | Intended CSS use |
| --- | --- | --- | --- | --- |
| `paper-background.webp` | 1536 × 1024 → 1536 × 1024 | Opaque | WebP quality 82 | `--paper-background`; full-page background texture. |
| `card-cover.webp` | 1024 × 1536 → 1024 × 1536 | Opaque | WebP quality 82 | `--card-cover`; closed-card paper base behind live text and photographic cutouts. |
| `card-inside.webp` | 1536 × 1024 → 1536 × 1024 | Opaque | WebP quality 82 | `--card-inside`; open two-panel interior base. |
| `carnation-petals.webp` | 1254 × 1254 → 1254 × 1254 | Alpha | Lossless WebP | `--carnation-petals`; movable flower head, layered over the stem. |
| `carnation-stem.webp` | 864 × 1821 → 864 × 1821 | Alpha | Lossless WebP | `--carnation-stem`; movable stem for the offered-flower motion. |
| `card-pocket.webp` | 1536 × 1024 → 1536 × 1024 | Alpha | Lossless WebP | `--card-pocket`; foreground pocket layered over the open-card base. |
| `photo-strip.webp` | 885 × 1778 → 885 × 1778 | Alpha | Lossless WebP | `--photo-strip`; revealable strip; the three apertures are transparent for real-photo content. |

## Alpha extraction note

The foreground source images were deliberately regenerated on a uniform `#00FF00` chroma-key field, with the same key colour visible through every photo-strip aperture. This created a deterministic, geometry-correct alpha mask rather than attempting to infer a mask from staged white/checkerboard imagery. The finishing command was:

```sh
ffmpeg -i SOURCE.png -vf 'format=rgba,colorkey=0x00ff00:0.20:0.08,despill=green:mix=1:expand=0.15' -frames:v 1 keyed.png
cwebp -lossless -z 9 keyed.png -o OUTPUT.webp
```

All four final alpha WebPs were composited at native resolution on pure black and pure white mattes. No rectangular staging field, checkerboard, yellow/green fringe, or opaque photo-strip aperture remains. The subtle dark lines at the photo-strip aperture edges are the retained inner cut-paper shadows, not an opaque fill.
