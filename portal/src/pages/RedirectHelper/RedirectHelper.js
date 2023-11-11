import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

/**
 * @class RedirectHelper
 */
class RedirectHelper extends PureComponent {
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      key: null,
      props: null,
    };

    // Bind method(s)
    this.go = this.go.bind(this);
  }

  /**
   * @public
   */
  go(to) {
    if (!to) return;
    if (typeof to === 'number') return window.history.go(to);
    this.setState({
      key: Math.random().toString(),
      props: typeof to === 'string' ? { to, push: !(to === '/404') } : to,
    });
  }

  render() {
    const { key, props } = this.state;
    return props && <Redirect key={key} push {...props} />;
  }
}

export default RedirectHelper;
