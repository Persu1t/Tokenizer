import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import readline from "readline";

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
  .split(/\s+/) 
  .filter(Boolean);

    let newWords = [];

    const ids = words.map(word => {
      if (word in this.word2id) {
        return this.word2id[word];
      } else {
        // Add word to vocab dynamically
        const id = this.nextId++;
        this.word2id[word] = id;
        this.id2word[id] = word;
        newWords.push(word);
        return id;
      }
    });

    // If we added new words, append to corpus and save vocab
    if (newWords.length > 0) {
      fs.appendFileSync(corpusPath, "\n" + newWords.join(" "), "utf-8");
      this.saveVocab(vocabPath);
      console.log(`Added new words: ${newWords.join(", ")}`);
    }

    return ids;
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter your text to encode: ", (answer)=>{
  // Encode the input text
  const encode = tokenizer.encode(answer);
  console.log("Encodeing complete.... ", encode);

  // Decode for the verification
  const decode = tokenizer.decode(encode);
  console.log("Decoded text:", decode);
  rl.close();
})
