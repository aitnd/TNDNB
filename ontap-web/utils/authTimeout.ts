/**
 * Bọc một promise với timeout. Nếu promise gốc không settle trong
 * `timeoutMs`, wrapper reject với `Error('timeout')`.
 * Dùng cho các call Firebase có thể treo vĩnh viễn khi mạng chập chờn
 * (không resolve cũng không reject) khiến UI kẹt ở trạng thái loading.
 */
export const timeoutWrapper = <T,>(promise: Promise<T>, timeoutMs = 15000): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), timeoutMs);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
};
