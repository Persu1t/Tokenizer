# SimpleTokenizer

A minimal JavaScript tokenizer implementation that learns its vocabulary from a fixed text corpus (`corpus.txt`) and supports both **encode** (text → token IDs) and **decode** (token IDs → text) operations.  
Built to demonstrate basic tokenization processing without using any external libraries.

---

## 📂 Project Structure
.
├── corpus.txt # Training text for building vocabulary
├── token.js # Main tokenizer implementation & CLI script
├── vocab.json # Auto-generated vocabulary from corpus.txt
├── package.json
└── README.md

---

## ⚙️ How It Works

1. Reads all text from `corpus.txt`.
2. Tokenizes words by splitting on spaces.
3. Assigns each **unique word** a numerical token ID.
4. Saves this mapping in `vocab.json`.
5. Uses the fixed vocabulary for:
   - **Encoding:** Converting text into an array of token IDs (`-1` for unknown words).
   - **Decoding:** Converting token IDs back into words (`<UNK>` for unknown IDs).
6. If word `-1` we can add it to the corpus and then map it for new use case or for future case.

---

## 📦 Installation

```bash
# Clone or download this repo
Use command `git clone`
`cd your-folder-name`

# Install dependencies (none needed for core functionality)
npm install

# Now run the code with code runner or node command. 