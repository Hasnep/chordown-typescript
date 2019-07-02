# Chordown

My own markdown based chordsheet converter. Written in Typescript and based on [Markato](https://markato.studio/).

Chordown files can be converted to plaintext, PDF (using (Xe)LaTeX), OnSong and (in the future) ChordPro.

## Chordown files

### Header

All Chordown files start with a YAML header with these properties, required properties **in bold**:

- **`title`**
- `subtitle`
- `artist`
- `key`
- `time` - time signature

### Body

The body contains lines of text with sections, chords and lyrics.

- Section lines begin with a hash
  `# Chorus`
- Chord lines begin with a colon
  `: C G Am F`
- Lyric lines can start with any character except a hash `#` or colon `:`, and chord symbols are positioned with carets/hats
  `^This is ^an ^ex^ample`

### Example chordown file

An example chordsheet file might look like this:

```
---
title: Example Song
artist: Hannes Smit
key: C
---

# Chorus:
: C        G    Am    F
  ^Example ^chor^down ^song!
```

## Chordown config files

To convert the input chordown files to another format, a YAML config file is used to specify the arguments.

- `base`
- `input`
- `output`
  - `json`
    - `path`
  - `txt`
    - `path`
  - `tex`
    - `path`
    - `compile` - the argument to run when compiling the `.tex` files
  - `onsong`
    - `path`

### Example config file

An example config file might look like

```
base: /mnt/c/Users/Hannes/OneDrive/Documents/Chords/
input: chordown/
output:
  json:
    path: output/chordown-json/
  txt:
    path: output/plaintext/
  tex:
    path: output/tex/
    compile: "latexmk -xelatex -interaction=nonstopmode"
  onsong:
    path: output/onsong/
```

## Commands

- Compile: `npm run build`
  - To rebuild continuously: `npm run build -- --watch`
- Run: `npm start -- cdconfig.yaml`
- Test: `npm test`
