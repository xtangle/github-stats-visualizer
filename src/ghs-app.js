import '@vaadin/vaadin-app-layout/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-password-field';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { html, css, LitElement } from 'lit-element';
import './ghs-pr-table';
import { GITHUB_GQL_API } from './constants';
import { fetchRateLimitData } from './client';
import { interpretErrorResponse } from './utils';

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
        margin: var(--lumo-space-l);
      }
      .drawer vaadin-form-layout > *:first-child {
        padding-top: 0;
      }
      .drawer vaadin-form-layout > vaadin-button {
        margin-top: var(--lumo-space-m);
      }
      .content {
        margin: 0 var(--lumo-space-l);
      }
      vaadin-button {
        cursor: pointer;
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
    fetchRateLimitData(this.api, this.auth).then((response) => {
      console.debug(response);
      const rateLimit = response.rateLimit;
      const rateLimitInfo = rateLimit
        ? `Your rate limit information:
           <br>• Limit: ${rateLimit.limit}
           <br>• Remaining: ${rateLimit.remaining}
           <br>• Resets in: ${formatDistanceStrict(parseISO(rateLimit.resetAt), new Date(), { unit: 'minute' })}`
        : 'Rate limit information unavailable';
      this.notificationOpts = {
        innerHTML: `Connection Success!<br>${rateLimitInfo}`,
        type: 'success',
        duration: 10000,
      };
      this.notification.open();
    }).catch((error) => {
      console.error(error);
      this.notificationOpts = {
        innerHTML: interpretErrorResponse(error),
        type: 'error',
        duration: 5000,
      };
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
          <h3 class="navbar__title">GitHub Stats Visualizer</h3>
        </div>
        <div slot="drawer" class="drawer">
          <h3>Settings</h3>
          <vaadin-form-layout>
            <vaadin-text-field label="API" value="${this.api}" @input="${e => this.api = e.path[0].value}"></vaadin-text-field>
            <vaadin-text-field label="Username" value="${this.auth.username}" @input="${e => this.auth.username = e.path[0].value}"></vaadin-text-field>
            <vaadin-password-field label="Password" value="${this.auth.password}" @input="${e => this.auth.password = e.path[0].value}"></vaadin-password-field>
            <vaadin-button @click="${this.testConnectionHandler}">Test Connection</vaadin-button>
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
