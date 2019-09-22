import { html, LitElement } from 'lit-element';
import './ghs-pr-table';

class GhsApp extends LitElement {
  static get properties() {
    return {
    };
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <ghs-pr-table></ghs-pr-table>
    `;
  }
}

customElements.define('ghs-app', GhsApp);
