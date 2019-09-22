import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import { LitElement, html } from 'lit-element';

class GhsPrTable extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
      loading: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.data = [];
    this.loading = false;

    fetch('https://demo.vaadin.com/demo-data/1.0/people?count=200')
      .then(res => res.json())
      .then(json => this.data = json.result);
  }

  render() {
    return html`
      <vaadin-grid .items="${this.data}" theme="row-dividers" multiSort="true">
        <vaadin-grid-sort-column path="firstName" header="First name"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="lastName" header="Last name"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="email" header="Email"></vaadin-grid-sort-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('ghs-pr-table', GhsPrTable);
