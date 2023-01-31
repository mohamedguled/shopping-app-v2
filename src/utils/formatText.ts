class formatClass {
  dash(text: string | null | undefined) {
    if (text) {
      return text.replace(/\s+/g, '-').replace('%20', '-').toLowerCase();
    }
  }

  dashCaseSensitive(text: string | null | undefined) {
    if (text) {
      return text.replace(/\s+/g, '-').replace('%20', '-');
    }
  }
}

const formatText = new formatClass();

export { formatText };
