import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SimpleTokenizer {
  constructor() {
    this.word2id = {};
    this.id2word = {};
    this.nextId = 0;
  }

  // Learn vocabulary from text
  fit(text) {
    const words = text
      .replace(/[^\w\s']/g, "") // remove punctuation except apostrophe
      .split(/\s+/)
      .filter(Boolean);

    for (const word of words) {
      if (!(word in this.word2id)) {
        this.word2id[word] = this.nextId;
        this.id2word[this.nextId] = word;
        this.nextId++;
      }
    }
  }

  // Encode text into array of IDs
  encode(text) {
    const words = text
      .replace(/[^\w\s']/g, "")
      .split(/\s+/)
      .filter(Boolean);

    return words.map(word =>
      word in this.word2id ? this.word2id[word] : -1
    );
  }

  // Decode array of IDs into text
  decode(ids) {
    return ids.map(id => (id in this.id2word ? this.id2word[id] : "<UNK>")).join(" ");
  }

  saveVocab(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.word2id, null, 2), "utf-8");
  }

  loadVocab(filePath) {
    const vocab = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    this.word2id = vocab;
    this.id2word = Object.fromEntries(
      Object.entries(vocab).map(([word, id]) => [id, word])
    );
    this.nextId = Object.keys(this.id2word).length;
  }
}

// ===== Main Script =====
const corpusPath = path.join(__dirname, "corpus.txt");
const vocabPath = path.join(__dirname, "vocab.json");


const tokenizer = new SimpleTokenizer();

// Always rebuild vocab from corpus.txt
console.log("Building vocabulary from corpus...");
const corpus = fs.readFileSync(corpusPath, "utf-8");
tokenizer.fit(corpus);
tokenizer.saveVocab(vocabPath);
console.log("Vocabulary saved to vocab.json");

// Text to encode from CLI or default
const testString = process.argv[2] || "hello world test";

const encoded = tokenizer.encode(testString);
const newEncodeString = tokenizer.encode("have fun world")

console.log("Encoded:", encoded);
console.log("New Encoded String:", newEncodeString);

// Decode for verification
const decoded = tokenizer.decode(encoded);
const decodedNew = tokenizer.decode(newEncodeString);
console.log("Decoded:", decoded);
console.log("Decoded New String:", decodedNew);
