class TrieNode {
  public isWord: boolean;
  public char: string;
  public nextWords: { [index: string]: TrieNode };

  constructor(char: string, isWord: boolean = false) {
    this.char = char;
    this.isWord = isWord;
    this.nextWords = {};
  }
}

export class Trie {
  public TrieHead: { [index: string]: TrieNode };
  private MAX_RECOMMENDATIONS: number = 5;
  constructor() {
    this.TrieHead = {};
  }

  clearTrie() {
    this.TrieHead = {};
  }

  insertArrayOfWords(arr: string[]): void {
    arr.forEach(word => {
      this.insertWord(word);
    });
  }

  private insertWord(str): void {
    if (!this.TrieHead[str[0]]) {
      this.TrieHead[str[0]] = new TrieNode(str[0]);
    }

    let currNode = this.TrieHead[str[0]];

    if (str.length === 1) {
      currNode.isWord = true;
      return;
    }

    for (let i = 1; i < str.length; i++) {
      const char = str[i];
      if (currNode.nextWords[char]) {
        currNode = currNode.nextWords[char];
      } else {
        currNode.nextWords[char] = new TrieNode(char);
        currNode = currNode.nextWords[char];
      }
    }

    currNode.isWord = true;
    return;
  }

  recommend(str: string): string[] {
    const accumulator = [];
    const recommended: string[] = [];

    if (!this.TrieHead[str[0]]) {
      return [];
    }

    let currNode = this.TrieHead[str[0]];
    accumulator.push(str[0]);

    for (let i = 1; i < str.length; i += 1) {
      const char = str[i];
      if (!currNode.nextWords[char]) {
        return [];
      }
      currNode = currNode.nextWords[char];
      accumulator.push(char);
    }

    if (currNode.isWord) {
      recommended.push(accumulator.join(""));
    }

    function recommendHelper(node: TrieNode, MAX_RECOMMENDATIONS: number) {
      accumulator.push(node.char);

      if (node.isWord) {
        recommended.push(accumulator.join(""));
      }

      if (recommended.length === MAX_RECOMMENDATIONS) {
        return recommended;
      }

      Object.values(node.nextWords).forEach(childNode => {
        recommendHelper(childNode, MAX_RECOMMENDATIONS);
      });

      accumulator.pop();
      return recommended;
    }

    // first we need to get to the final node
    // REMINDER TO POP OFF WHEN WE EXiT FUNCTION

    Object.values(currNode.nextWords).forEach(childNode => {
      recommendHelper(childNode, this.MAX_RECOMMENDATIONS);
    });

    return recommended;
  }
}
