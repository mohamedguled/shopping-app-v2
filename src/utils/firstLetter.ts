class firstLetterClass {
  upperCase(text: string | null | undefined) {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
    return;
  }
  lowerCase(text: string | null | undefined) {
    if (text) {
      return text.charAt(0).toLowerCase() + text.slice(1);
    }
    return;
  }
}

const firstLetterInstance = new firstLetterClass();

const firstLetter = firstLetterInstance;

export default firstLetter;
