export const errorInterpreter = (error) => {
  if (Array.isArray(error) && error.length > 0) {
    return errorInterpreter(error[0]);
  }
  if (error.message) {
    return `Error: ${error.message}`;
  }
  if (error.responseXML) {
    const titleElem = error.responseXML.querySelector('title');
    if (titleElem && titleElem.textContent) {
      return `Error: ${titleElem.textContent}`
    }
  }
  if (error.status !== null && error.status !== undefined) {
    return `Error: Status Code ${error.status} ${error.statusText ? `(${error.statusText})` : ''}`;
  }
  return 'Unknown Error';
};
