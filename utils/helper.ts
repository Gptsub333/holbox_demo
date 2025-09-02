
const helpers = {


  getFileExtension: (fileUrl: string) => {
    try {
      const pathname = new URL(fileUrl).pathname
      return pathname.split('.').pop()?.toLowerCase()
    } catch (error) {
      console.error('Invalid URL', error)
      return null
    }
  },

  checkAudioFileType: function (file: File | null) {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/webm', 'audio/ogg']
    console.log(file?.type)
    if (file && !allowedTypes.includes(file.type))
      return 'Invalid file type. Only MP3, WAV, M4A, WEBM, and OGG files are allowed.'
  },

  fileSize:
    (maximumSize = 52428800, sizeInMB = '50MB') =>
      (file: File) =>
        file && file.size > maximumSize
          ? `Upload file less than  ${sizeInMB}`
          : undefined,

  checkAudioCorruption: async function (file: File | null): Promise<string | undefined> {
    if (!file) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      await audioContext.decodeAudioData(arrayBuffer); // will throw error if corrupted
      return undefined; // file is valid
    } catch (error) {
      return 'The selected audio file appears to be corrupted or unreadable.';
    }
  },

  uploadFile: async (selectedFile: File, token: string, setUploadProgress?: (p: number) => void, onAbortRef?: React.MutableRefObject<null | (() => void)>) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', selectedFile);

      xhr.open('POST', `${process.env.NEXT_PUBLIC_BACKEND_URL}/healthscribe/upload-audio`);

      // ✅ Add Authorization header
      xhr.setRequestHeader('Authorization', token);

      // ✅ Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && setUploadProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      // ✅ Handle success
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      // ✅ Handle error
      xhr.onerror = () => reject(new Error("Network error while uploading"));
      xhr.onabort = () => reject(new DOMException("Upload canceled", "AbortError"));

      // ✅ Expose abort function to outside via ref
      if (onAbortRef) {
        onAbortRef.current = () => xhr.abort();
      }

      xhr.send(formData);
    });
  },

  checkAudioDuration: async (file: File, maxMinutes: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const audioContext = new AudioContext();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject("Failed to read file");
        const arrayBuffer = e.target.result as ArrayBuffer;

        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
          const durationInMinutes = buffer.duration / 60;
          resolve(durationInMinutes <= maxMinutes);
        }, reject);
      };

      reader.readAsArrayBuffer(file);
    });
  }

}

export default helpers
