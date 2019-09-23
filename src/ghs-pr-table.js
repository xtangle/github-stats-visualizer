import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-notification/vaadin-notification';
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar';
import { differenceInBusinessDays, format, parseISO, startOfDay, subDays } from 'date-fns';
import { css, html, LitElement } from 'lit-element';
import { fetchPullRequestData } from './client';
import './ghs-notification';
import { GITHUB_SEARCH_QUERY_TIMESTAMP_FMT, PR_STATUSES, YESNO } from './constants';

class GhsPrTable extends LitElement {
  static get properties() {
    return {
      api: { type: String },
      auth: { type: Object },
      data: { type: Array },
      metadata: { type: Object },
      loading: { type: Boolean },
      error: { type: String },
      searchQuery: { type: String },
    };
  }

  static get styles() {
    return css`
      .controls {
        display: flex;
        flex-direction: row;
        padding-bottom: var(--lumo-space-m);
      }
      .controls > *:not(:last-child) {
        margin-right: var(--lumo-space-m);
      }
      .controls__search {
        padding-top: 0;
        flex-grow: 1;
      }
      .controls__reload {
        cursor: pointer;
        align-self: flex-end;
      }
      .link__icon {
        margin-top: -3px;
        --iron-icon-width: 16px;
        --iron-icon-height: 16px;
        --iron-icon-fill-color: var(--lumo-primary-color);
      }
      .num-items-indicator {
        margin-top: var(--lumo-space-xs);
        text-align: end;
      }
      vaadin-grid {
        height: calc(100vh - 16em);
      }
    `;
  }

  constructor() {
    super();
    this.data = [];
    this.metadata = {
      totalCount: 0,
    };
    this.loading = false;

    const endDate = new Date();
    const startDate = startOfDay(subDays(endDate, 14));
    this.searchQuery = `org:"GoogleChrome" created:${format(startDate, GITHUB_SEARCH_QUERY_TIMESTAMP_FMT)}..${format(endDate, GITHUB_SEARCH_QUERY_TIMESTAMP_FMT)}`;
  }

  get notification() {
    return this.shadowRoot.getElementById('ghs-pr-table-notification');
  }

  get gridColumns() {
    return this.shadowRoot.querySelectorAll('vaadin-grid-column,vaadin-grid-sort-column');
  }

  reload() {
    this.loading = true;
    fetchPullRequestData(this.api, this.auth, this.searchQuery).then((response) => {
      console.debug(response);
      this.consumeResponse(response);
    }).catch((error) => {
      console.error(error);
      this.error = error.message ? `Error: ${error.message}` : 'Unknown Error';
      this.notification.open();
    }).finally(() => {
      this.loading = false;
    });
  }

  firstUpdated(changedProperties) {
    this.gridColumns[11].renderer = (root, column, rowData) => {
      root.innerHTML = `<a class="link" href="${rowData.item.link}" target="_blank"><iron-icon class="link__icon" icon="vaadin:external-link"></iron-icon></a>`;
    }
  }

  consumeResponse(response) {
    this.data = response.search.nodes.map(pr => ({
      repository: pr.repository.name,
      title: pr.title,
      commits: pr.commits.totalCount,
      files: pr.files.totalCount,
      additions: pr.files.nodes.reduce((acc, v) => acc + v.additions, 0),
      deletions: pr.files.nodes.reduce((acc, v) => acc + v.deletions, 0),
      participants: pr.participants.totalCount,
      reviews: pr.reviews.totalCount,
      status: pr.closed ? PR_STATUSES.CLOSED : PR_STATUSES.OPEN,
      merged: pr.merged ? YESNO.YES : YESNO.NO,
      daysOpen: differenceInBusinessDays(pr.closed ? parseISO(pr.closedAt) : new Date(), parseISO(pr.createdAt)),
      link: pr.url,
    }));
    this.metadata = {
      totalCount: response.search.issueCount,
    };
  };

  searchInputChangeHandler(e) {
    this.searchQuery = e.path[0].value;
  }

  searchInputEnterHandler(e) {
    if (e.key === 'Enter') {
      this.reload();
    }
  }

  render() {
    return html`
      <h3>Pull Requests</h3>
      <div class="controls">
        <vaadin-text-field class="controls__search" label="Search Query" value="${this.searchQuery}" 
          @input="${this.searchInputChangeHandler}" @keydown="${this.searchInputEnterHandler}"></vaadin-text-field>
        <vaadin-button class="controls__reload" @click="${this.reload}" theme="icon" aria-label="Reload" title="Reload">
          <iron-icon icon="vaadin:refresh"></iron-icon>
        </vaadin-button>
      </div>
      <ghs-notification id="ghs-pr-table-notification" type="error" innerHTML="${this.error}"></ghs-notification>
      ${this.loading ? html`<vaadin-progress-bar indeterminate value="0"></vaadin-progress-bar>` : ''}
      <vaadin-grid .items="${this.data}" theme="row-dividers" column-reordering-allowed multi-sort>
        <vaadin-grid-sort-column path="repository" title="repository" header="Repository" flex-grow="3"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="title" header="Title" flex-grow="10"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="commits" header="Commits" text-align="end"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="files" header="Files" text-align="end"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="additions" header="Additions" text-align="end"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="deletions" header="Deletions" text-align="end"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="participants" header="Participants" text-align="end"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="reviews" header="Reviews" text-align="end"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="status" header="Status" text-align="end"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="merged" header="Merged" text-align="end"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="daysOpen" header="Days open" text-align="end"></vaadin-grid-sort-column>
        <vaadin-grid-column path="link" header="Link" width="4em" flex-grow="0" text-align="end" frozen></vaadin-grid-column>
      </vaadin-grid>
      ${this.data.length ? html`<div class="num-items-indicator">Showing ${this.data.length} of ${this.metadata.totalCount} items</div>` : ''}
    `;
  }
}

customElements.define('ghs-pr-table', GhsPrTable);
