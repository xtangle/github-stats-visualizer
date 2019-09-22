import { html, LitElement } from 'lit-element';

class GhsNotification extends LitElement {
  static get properties() {
    return {
      id: { type: String },
      duration: { type: Number },
      innerHTML: { type: String },
      type: { type: String },
      position: { type: String },
    };
  }

  constructor() {
    super();
    this.message = '';
    this.duration = 5000;
    this.position = 'top-end';
  }

  get notification() {
    return this.shadowRoot.getElementById(this.id);
  }

  close() {
    this.notification.close();
  }

  open() {
    this.requestUpdate().then(() => {
      this.notification.renderer = (root, owner) => {
        root.innerHTML = this.innerHTML;
        root.addEventListener('click', () => owner.close());
      };
      this.notification.open();
    });
  }

  render() {
    return html`
      <vaadin-notification id="${this.id}" duration="${this.duration}" position="${this.position}" theme="${this.type}"></vaadin-notification>
    `;
  }
}

customElements.define('ghs-notification', GhsNotification);
