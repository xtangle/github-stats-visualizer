export const interpretErrorResponse = (error) => {
  if (Array.isArray(error) && error.length > 0) {
    return interpretErrorResponse(error[0]);
  }
  if (error.message) {
    return `Error: ${error.message}`;
  }
  if (error.responseXML) {
    const titleElem = error.responseXML.querySelector('title');
    if (titleElem && titleElem.textContent) {
      return `Error: ${titleElem.textContent}`;
    }
  }
  if (error.status !== null && error.status !== undefined) {
    return `Error: Status Code ${error.status} ${error.statusText ? `(${error.statusText})` : ''}`;
  }
  return 'Unknown Error';
};

export const exportCsv = async (filename, grid) => {
  const sortedItems = await new Promise((resolve) => {
    grid.dataProvider({
      sortOrders: grid._sorters.map(s => s.__data),
      page: 0,
      pageSize: 100,
    }, (items) => resolve(items));
  });
  const colsInOrder = grid._getColumnsInOrder();
  const headers = colsInOrder.map(c => c.attributes['header'].value);
  const paths = colsInOrder.map(c => c.attributes['path'].value);
  const csvHeaderContent = headers.join(',');
  const csvBodyContent = new json2csv.Parser({ fields: paths, header: false, eol: '\n' }).parse(sortedItems);
  const csvContent = csvHeaderContent + '\n' + csvBodyContent;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const applyColorizedRenderers = (grid, props) => {
  props.forEach(prop => {
    const {
      path,
      bounds,
      partitioner,
      excludes = v => v === null || v === undefined,
      colors = ['green', 'yellow', 'red'],
      alpha = 0.5,
      reversed = false,
      valueExtractor = (rowData, path) => getPropByPath(rowData.item, path),
      additionalRenderers = [],
    } = prop;
    getColumnByPath(grid, path).renderer = (root, column, rowData) => {
      const value = valueExtractor(rowData, path);
      if (!excludes(value)) {
        let gradientAt = bounds
          ? Math.min(Math.max((value - bounds[0]) / (bounds[1] - bounds[0]), 0), 1)
          : (partitioner(value) ? 0 : 1);
        if (reversed) {
          gradientAt = 1 - gradientAt;
        }
        root.style.backgroundColor = tinygradient(...colors).rgbAt(gradientAt).setAlpha(alpha).toRgbString();
      }
      root.innerHTML = value;
      additionalRenderers.forEach(renderer => renderer(root, column, rowData));
    };
  })
};

export const getColumnByPath = (grid, path) => grid.querySelector(`:scope > *[path="${path}"]`);

export const getPropByPath = (obj, key) => key.split('.').reduce((a, b) => a && a[b], obj);
