export function readFileContentAsBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
        };
        reader.onerror = (event) => {
            reject((event as ErrorEvent & ProgressEvent).message);
        };
        if (file) {
            reader.readAsArrayBuffer(file);
        } else {
            reject(`no file selected `);
        }
    });
}
