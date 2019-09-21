import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      message: { type: String },
    };
  }

  constructor() {
    super();
    this.message = 'No message set!';
  }

  render() {
    return html`
      <p>${this.message} From my-element</p>
    `;
  }
}

customElements.define('my-element', MyElement);
