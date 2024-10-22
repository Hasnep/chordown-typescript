# Chordown

I've abandoned this version of this project and have switched to a [Rust rewrite](https://github.com/Hasnep/chordown).

My own markdown based chordsheet converter. Written in Typescript and based on [Markato](https://markato.studio/).

Chordown files can be converted to plaintext, PDF (using (Xe)LaTeX), OnSong and (in the future) ChordPro.

## Installation

Clone the repo using ssh

```shell
git clone git@github.com:Hasnep/chordown.git
```

or using HTTPS

```shell
git clone https://github.com/Hasnep/chordown.git
```

```shell
cd chordown/
npm install # Install dependencies
npm run build # Compile the Typescript
npm link # create a global symlink
```

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

To convert the input chordown files to another format, a TOML config file is used to specify the arguments.

- `input`
  - `path`
- `output`
  - `json`
    - `path`
  - `txt`
    - `path`
  - `tex`
    - `path`
    - `compile` - the argument to run when compiling the `.tex` files
    - `template` - the path to the tex template file
  - `onsong`
    - `path`

If the config file is specified as a commandline argument, the arguments will override the global config file at `~/.config/chordown/config.toml`.

### Example config file

An example config file might look like

```
[input]
path = "~/chords/input/**/*.cd"

[output.json]
path = "~/chords/output/chordown-json/"

[output.txt]
path = "~/chords/output/plaintext/"

[output.tex]
path = "~/chords/output/latex/"
compile = "xelatex"

[output.onsong]
path = "~/chords/output/onsong/"
```
