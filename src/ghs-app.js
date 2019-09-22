import '@vaadin/vaadin-app-layout/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-password-field';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { html, css, LitElement } from 'lit-element';
import './ghs-pr-table';
import { GITHUB_GQL_API } from './constants';
import { fetchRateLimitData } from './gql-client';

class GhsApp extends LitElement {
  static get properties() {
    return {
      api: { type: String },
      auth: { type: Object },
      notificationOpts: { type: Object },
    };
  }

  static get styles() {
    return css`
      .navbar__drawer-toggle {
        cursor: pointer;
      }
      .navbar__title {
        display: inline-block;
        margin: 0;
      }
      .drawer {
        margin: 1.5em;
      }
      .drawer__button {
        cursor: pointer;
        margin-top: var(--lumo-space-m);
      }
      .content {
        margin: 0 1.5em;
      }
    `;
  }

  constructor() {
    super();
    this.api = GITHUB_GQL_API;
    this.auth = {
      username: '',
      password: '',
    };
    this.notificationOpts = {};
  }

  get notification() {
    return this.shadowRoot.getElementById('ghs-app-notification');
  }

  testConnectionHandler() {
    fetchRateLimitData(this.api, this.auth)().then((response) => {
      const rateLimit = response.rateLimit;
      const rateLimitInfo = rateLimit
        ? `Your rate limit information:<br>Limit: ${rateLimit.limit}<br>Remaining: ${rateLimit.remaining}<br>Resets in: ${formatDistanceStrict(parseISO(rateLimit.resetAt), new Date())}`
        : 'Rate limit information unavailable';
      this.notificationOpts = {
        innerHTML: `Connection Success!<br>${rateLimitInfo}`,
        type: 'success',
        duration: 10000,
      };
    }).catch((error) => {
      this.notificationOpts = {
        innerHTML: error.message ? `Error: ${error.message}` : 'Unknown Error',
        type: 'error',
        duration: 5000,
      };
    }).finally(() => {
      this.notification.open();
    });
  }

  render() {
    return html`
      <vaadin-app-layout>
        <ghs-notification id="ghs-app-notification" innerHTML="${this.notificationOpts.innerHTML}" 
          type="${this.notificationOpts.type}" duration="${this.notificationOpts.duration}"></ghs-notification>
        <div slot="navbar" class="navbar">
          <vaadin-drawer-toggle class="navbar__drawer-toggle"></vaadin-drawer-toggle>
          <h3 class="navbar__title">Github Stats</h3>
        </div>
        <div slot="drawer" class="drawer">
          <h3>Settings</h3>
          <vaadin-form-layout>
            <vaadin-text-field label="API" value="${this.api}" @input="${e => this.api = e.path[0].value}"></vaadin-text-field>
            <vaadin-text-field label="Username" value="${this.auth.username}" @input="${e => this.auth.username = e.path[0].value}"></vaadin-text-field>
            <vaadin-password-field label="Password" value="${this.auth.password}" @input="${e => this.auth.password = e.path[0].value}"></vaadin-password-field>
            <vaadin-button class="drawer__button" @click="${this.testConnectionHandler}">Test Connection</vaadin-button>
          </vaadin-form-layout>
        </div>
        <div class="content">
          <ghs-pr-table api="${this.api}" .auth="${this.auth}"></ghs-pr-table>
        </div>
      </vaadin-app-layout>
    `;
  }
}

customElements.define('ghs-app', GhsApp);
