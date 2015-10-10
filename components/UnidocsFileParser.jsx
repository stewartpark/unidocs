/* jshint esnext: true */

export default class UnidocsFileParser {
  constructor(fileContent) {
    this.fileContent = fileContent;
  }

  parse() {
    return JSON.parse(this.fileContent);
  }
}
