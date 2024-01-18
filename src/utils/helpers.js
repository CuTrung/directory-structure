export const mapDataOptions = (data = [], valueName = 'value', labelName = 'label', valueAsString = false) =>
  data?.map(({ name, id, ...item }) => {
    return { ...item, label: item[labelName] ?? name, value: [valueAsString ? String : Number](id || item[valueName]) };
  });

export const readImageAsBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const isFunctionComponent = (component) => {
  return typeof component === 'function' && String(component).includes('return React.createElement');
};

export const capitalizedString = (value) => {
  if (typeof value !== 'string') return value;
  value = value.toLowerCase();
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const createDownloadFile = (blob, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
};

export const downloadFileUrl = async (url, fileName) => {
  const blob = await fetch(url).then((r) => r.blob());
  createDownloadFile(blob, fileName ? fileName : url.split('/').pop());
};

export const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

export const convertToListOptions = (list = [{ label: '', value: '' }]) =>
  list.map((item) => {
    const key = Object.keys(item);
    return { label: key, value: item[key] };
  });
