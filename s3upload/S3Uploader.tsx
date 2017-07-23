import * as React from 'react';
import S3UploadUtil from './s3uploadUtil';
import { ProgressBar } from './ProgressBar';

export interface S3UploaderProps {
  clss?: string;
  id?: string;
  label: string;
  signingUrl: string;
  accept: string;
  multiple: boolean;
  getSignedUrl: () => string;
  preprocess?: (file: any, next: any) => void;
  onProgress?: (percentage: number, message: string, processFile: any) => void;
  onFinish?: (signResult: any) => void;
  onError?: (message: string) => void;
  signingUrlMethod?: string;
  signingUrlHeaders?: object;
  signingUrlQueryParams?: any;
  signingUrlWithCredentials?: boolean;
  uploadRequestHeaders: object;
  contentDisposition: string;
  server: string;
  scrubFilename?: (filename: string) => string;
}

export class S3Uploader extends React.Component<S3UploaderProps, any> {

  private inputElm: HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      progress: {},
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.resetFile = this.resetFile.bind(this);
    this.preprocess = this.preprocess.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.onError = this.onError.bind(this);
    this.scrubFilename = this.scrubFilename.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize();
  }

  initialize() {
    this.setState({
      files: [],
      progress: {},
    });
  }

  uploadFile() {
    this.setState({
      files: this.toArray(this.state.files).concat(this.toArray(this.inputElm.files)),
    });
    S3UploadUtil.handleUpload({
      files: this.inputElm.files, // Only update new files
      signingUrl: this.props.signingUrl,
      getSignedUrl: this.props.getSignedUrl,
      preprocess: this.preprocess,
      onProgress: this.onProgress,
      onFinishS3Put: this.onFinish,
      onError: this.onError,
      signingUrlMethod: this.props.signingUrlMethod || 'GET',
      signingUrlHeaders: this.props.signingUrlHeaders,
      signingUrlQueryParams: this.props.signingUrlQueryParams,
      signingUrlWithCredentials: this.props.signingUrlWithCredentials || false,
      uploadRequestHeaders: this.props.uploadRequestHeaders,
      contentDisposition: this.props.contentDisposition,
      server: this.props.server || '',
      scrubFilename: this.scrubFilename,
    });
  }

  toArray(fileList) {
    return Array.prototype.slice.call(fileList);
  }

  /**
   * Helper function to get array of file in current uploaded
   */
  getFilesUploaded() {
    return this.state.files;
  }

  openFileUpload() {
    this.inputElm.click();
  }

  preprocess(fileObj, nextFunc) {
    if (this.props.preprocess) {
      this.props.preprocess(fileObj, nextFunc);
    } else {
      console.log(`preprocess:  ${fileObj.name}`);
      nextFunc(fileObj);
    }
  }

  onProgress(percentage: number, message: string, processFile: any) {
    if (this.props.onProgress) {
      this.props.onProgress(percentage, message, processFile);
    } else {
      // console.log(processFile);
      const obj = {};
      const key = `ts_${processFile.lastModified}_${processFile.name}`;
      obj[key] = percentage;
      console.log(obj);
      this.setState({
        progress: {
          ...this.state.progress,
          ...obj,
        },
      });
      console.log(`Upload progress: ${percentage}% ${message}`);
    }
  }

  onFinish(signResult) {
    if (this.props.onFinish) {
      this.props.onFinish(signResult);
    } else {
      console.log(`Upload finished: ${signResult.publicUrl}`);
    }
  }

  onError(message: string) {
    if (this.props.onError) {
      this.props.onError(message);
    } else {
      console.log(`Upload error: ${message}`);
    }
  }

  scrubFilename(filename: string) {
    if (this.props.scrubFilename) {
      this.props.scrubFilename(filename);
    } else {
      return filename.replace(/[^\w\d_\-\.]+/ig, '');
    }
  }

  bytesToSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return `0 Byte`;
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const fileSize = Math.round((bytes / Math.pow(1024, i)) * 100) / 100;
    return `${fileSize} ${sizes[i]}`;
  }

  getProgress(file) {
    const key = `ts_${file.lastModified}_${file.name}`;
    // console.log(this.state.progress);
    if (this.state.progress[key]) {
      return this.state.progress[key];
    } else {
      return 0;
    }
  }

  getUploadedFiles() {
    return {
      files: this.state.files,
      progress: this.state.progress,
    };
  }

  // cancelUpload(file) {
  // }

  resetFile() { // Reset input
    this.inputElm.form.reset();
  }

  renderFiles() {
    const files = this.state.files || [];
    const fileItems = [];
    // console.log(files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = this.getProgress(file);
      const checkHide = (progress === 100) ? '' : 'hide';
      fileItems.push(<div key={i} className="row has-borders no-border-top no-border-left no-border-right pad-top-md pad-bottom-md">
        <div className="col-xs-10">
          <p>
            <span>{file.name}</span>
            <span className="pull-right">{this.bytesToSize(file.size)}</span>
          </p>
          <ProgressBar type="info" value={progress} />
        </div>
        <div className="col-xs-2 text-right vertical-bottom">
          {/* <button type="button" className="btn btn-action pad-left-sm pad-right-sm" onClick={this.cancelUpload.bind(this, file)}>
            <i className="pi pi-trash-o cursor-pointer"></i>
          </button>*/}
          <span className={`pi pi-check text-success ${checkHide}`} style={{ 'font-size': '2em' }}></span>
        </div>
      </div>);
    }
    return (
      <div className="list-unstyled text-left">
        {fileItems}
      </div>
    );
  }

  public render() {
    return (
      <div className={`${this.props.clss || ''}`} id={`${this.props.id || ''}`}>
        <form className="input-upload btn btn-default" >
          <input type="file" onChange={this.uploadFile} onClick={this.resetFile}
            accept={this.props.accept}
            multiple={this.props.multiple || false}
            ref={(ref) => this.inputElm = ref } />
          <span>{this.props.label}</span>
        </form>
        <div className="input-upload-filename mar-top-md">
          {this.renderFiles()}
        </div>
      </div>
    );
  }
}
