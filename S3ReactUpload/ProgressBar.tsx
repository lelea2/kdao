import * as React from 'react';

export interface ProgressBarProps {
  clss?: string;
  type: string;
  value: number;
};

export class ProgressBar extends React.Component<ProgressBarProps, any> {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  getClss() {
    let type = '';
    switch (this.props.type) {
      case 'success':
        type = 'progress-bar-success';
      case 'info':
        type = 'progress-bar-info';
      case 'warning':
        type = 'progress-bar-warning';
      case 'danger':
        type = 'progress-bar-danger';
      default:
        type = '';
    }
    return `${type} ${this.props.clss || ''}`;
  }

  public render() {
    const clss = this.getClss();
    const style = {
      width: `${this.state.value}%`,
    };
    return (
      <div className="progress">
        <div className={`progress-bar ${clss}`}
          role="progressbar" aria-valuenow={this.state.value}
          aria-valuemin="0" aria-valuemax="100"
          style={style}>
          <span className="sr-only">{`${this.state.value}% Complete}`}</span>
        </div>
      </div>
    );
  }

}
