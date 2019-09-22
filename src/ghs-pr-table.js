import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar';
import '@vaadin/vaadin-notification/vaadin-notification';
import { css, html, LitElement } from 'lit-element';
import { fetchRateLimitData } from './gql-client';
import './ghs-notification';

class GhsPrTable extends LitElement {
  static get properties() {
    return {
      api: { type: String },
      auth: { type: Object },
      data: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
    };
  }

  static get styles() {
    return css`
      .header {
        display: flex;
      }
      .header__title {
        flex-grow: 1;
      }
      .header__button {
        align-self: center;
        cursor: pointer;
      }
    `;
  }

  constructor() {
    super();
    this.data = [];
    this.loading = false;
  }

  get notification() {
    return this.shadowRoot.getElementById('ghs-pr-table-notification');
  }

  reload() {
    this.loading = true;
    fetchRateLimitData(this.api, this.auth)().then((response) => {
      // response is originally response.data of query result
      console.log('RESPONSE: ', response);
    }).catch((error) => {
      this.error = error.message ? `Error: ${error.message}` : 'Unknown Error';
      this.notification.open();
    }).finally(() => {
      this.loading = false;
    });
  }

  render() {
    return html`
      <div class="header">
        <h3 class="header__title">Pull Requests</h3>
        <vaadin-button @click="${this.reload}" class="header__button" theme="icon" aria-label="Reload" title="Reload">
          <iron-icon icon="vaadin:refresh"></iron-icon>
        </vaadin-button>
      </div>
      <ghs-notification id="ghs-pr-table-notification" type="error" innerHTML="${this.error}"></ghs-notification>
      ${this.loading ? html`<vaadin-progress-bar indeterminate value="0"></vaadin-progress-bar>` : ''}
      <vaadin-grid .items="${this.data}" theme="row-dividers" multiSort="true">
        <vaadin-grid-sort-column path="firstName" header="First name"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="lastName" header="Last name"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="email" header="Email"></vaadin-grid-sort-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('ghs-pr-table', GhsPrTable);
