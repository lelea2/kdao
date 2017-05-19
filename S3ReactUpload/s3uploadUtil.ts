declare var XMLHttpRequest: any;

export type S3UploadUtilData = {
  files: any;
  signingUrl: string;
  getSignedUrl: () => string;
  preprocess: any;
  onProgress: any;
  onFinishS3Put: any;
  onError: any;
  signingUrlMethod: any;
  signingUrlHeaders: any;
  signingUrlQueryParams: any;
  signingUrlWithCredentials: any;
  uploadRequestHeaders: any;
  contentDisposition: any;
  server: string;
  scrubFilename: any;
};

class S3UploadUtil {

  private static files;
  private static server = '';
  private static httprequest;
  private static signingUrl = '/sign-s3';
  private static signingUrlMethod = 'GET';
  private static getSignedUrl;
  private static signingUrlQueryParams;
  private static signingUrlHeaders;
  private static signingUrlWithCredentials;
  private static contentDisposition;
  private static uploadRequestHeaders;

  constructor() {
    console.log('>>>> S3UploadUtil: construct object <<<<');
  }

  public static handleUpload(data: S3UploadUtilData) {
    console.log('>>> Handle upload <<<<');
    this.server = data.server;
    this.signingUrl = data.signingUrl;
    this.preprocess = data.preprocess;
    this.onProgress = data.onProgress;
    this.onFinishS3Put = data.onFinishS3Put;
    this.onError = data.onError;
    this.signingUrlMethod = data.signingUrlMethod;
    this.signingUrlHeaders = data.signingUrlHeaders;
    this.signingUrlQueryParams = data.signingUrlQueryParams;
    this.signingUrlWithCredentials = data.signingUrlWithCredentials;
    this.uploadRequestHeaders = data.uploadRequestHeaders;
    this.contentDisposition = data.contentDisposition;
    this.scrubFilename = data.scrubFilename;
    // Handle select file
    this.handleFileSelect(data.files);
  }

  private static onFinishS3Put(signResult: any, file: string) {
    console.log('onFinishS3Put: ', signResult.publicUrl);
  }

  private static preprocess(file: string, next: any) {
    console.log('preprocess: ', file);
    return next(file);
  }

  private static onProgress(percentage: number, status: string, processedFile: any) {
    // console.log(processedFile);
    console.log('onProgress: ', percentage, status);
  }

  private static onError(status: string, file: string) {
    console.log('onError: ', status);
  }

  private static scrubFilename(filename: string): string {
    return filename.replace(/[^\w\d_\-\.]+/ig, '');
  }

  private static createCORSRequest(method: string, url: string, options: any): any {
    let opts = options || {};
    let xhr = new XMLHttpRequest();
    if (xhr.withCredentials != null) {
      xhr.open(method, url, true);
      if (opts.withCredentials != null) {
        xhr.withCredentials = opts.withCredentials;
      }
    } else {
      xhr = null;
    }
    return xhr;
  }

  private static uploadFile(file: string): any {
    let uploadToS3Callback = this.uploadToS3.bind(this, file);
    if (this.getSignedUrl) {
      return this.getSignedUrl(file, uploadToS3Callback);
    }
    return this.executeOnSignedUrl(file, uploadToS3Callback);
  }

  public static abortUpload() {
    if (this.httprequest) {
      this.httprequest.abort();
    }
  }

  private static handleFileSelect(files: any) {
    let result = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.preprocess(file, (processedFile) => {
        // console.log(processedFile);
        this.onProgress(0, 'Waiting', processedFile);
        result.push(this.uploadFile(processedFile));
        return result;
      });
    }
  }

  private static executeOnSignedUrl(file, callback) {
    let fileName = this.scrubFilename(file.name);
    let queryString = `?objectName=${fileName}&contentType=${encodeURIComponent(file.type)}`;
    if (this.signingUrlQueryParams) {
      let signingUrlQueryParams = (typeof this.signingUrlQueryParams === 'function') ? this.signingUrlQueryParams() : this.signingUrlQueryParams;
      Object.keys(signingUrlQueryParams).forEach((key) => {
        queryString += `&${key}=${signingUrlQueryParams[key]}`;
      });
    }
    let xhr = this.createCORSRequest(this.signingUrlMethod, `${this.server}${this.signingUrl}${queryString}`, { withCredentials: this.signingUrlWithCredentials });
    if (this.signingUrlHeaders) {
      const signingUrlHeaders = this.signingUrlHeaders;
      Object.keys(signingUrlHeaders).forEach((key) => {
        xhr.setRequestHeader(key, signingUrlHeaders[key]);
      });
    }
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let result;
        try {
          result = JSON.parse(xhr.responseText);
        } catch (error) {
          this.onError('Invalid response from server', file);
          return false;
        }
        return callback(result);
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        return this.onError(`Could not contact request signing server. Status = ${xhr.status}`, file);
      }
    };
    return xhr.send();
  }

  private static uploadToS3(file: any, signResult: any) {
    let xhr = this.createCORSRequest('PUT', signResult.signedUrl, null);
    if (!xhr) {
      this.onError('CORS not supported', file);
    } else {
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.onProgress(100, 'Upload completed', file);
          return this.onFinishS3Put(signResult, file);
        } else {
          return this.onError(`Upload error: ${xhr.status}`, file);
        }
      };
      xhr.onerror = () => {
        return this.onError('XHR error: ', file);
      };
      xhr.upload.onprogress = (e) => {
        let percentLoaded;
        if (e.lengthComputable) {
          percentLoaded = Math.round((e.loaded / e.total) * 100);
          return this.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing' : 'Uploading', file);
        }
      };
    }
    xhr.setRequestHeader('Content-Type', file.type);
    if (this.contentDisposition) {
      let disposition = this.contentDisposition;
      if (disposition === 'auto') {
        if (file.type.substr(0, 6) === 'image/') {
          disposition = 'inline';
        } else {
          disposition = 'attachment';
        }
      }
      xhr.setRequestHeader('Content-Disposition', `${disposition}; filename="${this.scrubFilename(file.name)}"`);
    }
    if (this.uploadRequestHeaders) {
      const uploadRequestHeaders = this.uploadRequestHeaders;
      Object.keys(uploadRequestHeaders).forEach((key) => {
        xhr.setRequestHeader(key, uploadRequestHeaders[key]);
      });
    } else {
      xhr.setRequestHeader('x-amz-acl', 'public-read');
    }
    this.httprequest = xhr;
    return xhr.send(file);
  }
}

export default S3UploadUtil;
