import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import { html, LitElement } from 'lit-element';

class MyTable extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
    };
  }

  constructor() {
    super();
    this.data = [{
      'firstName': 'Angel',
      'lastName': 'Kelly',
      'address': {
        'street': '9386 Crystal Oak Beach',
        'city': 'Bacon',
        'state': 'Maryland',
        'zip': '21997-5878',
        'country': 'USA',
        'phone': '(240) 555-5122',
      },
      'email': 'angel.kelly@company.com',
    }, {
      'firstName': 'Ethan',
      'lastName': 'Rivera',
      'address': {
        'street': '9478 Hazy Green',
        'city': 'Ragged Top',
        'state': 'New Hampshire',
        'zip': '03658-0772',
        'country': 'USA',
        'phone': '(603) 555-5774',
      },
      'email': 'ethan.rivera@company.com',
    }, {
      'firstName': 'Madison',
      'lastName': 'Davis',
      'address': {
        'street': '1221 Dewy Nectar Plaza',
        'city': 'Hassunadchuauck',
        'state': 'Virginia',
        'zip': '24556-5874',
        'country': 'USA',
        'phone': '(571) 555-3265',
      },
      'email': 'madison.davis@company.com',
    }, {
      'firstName': 'Aaron',
      'lastName': 'Garcia',
      'address': {
        'street': '2785 Blue Fox Chase',
        'city': 'Porkey',
        'state': 'West Virginia',
        'zip': '26230-0720',
        'country': 'USA',
        'phone': '(681) 555-1257',
      },
      'email': 'aaron.garcia@company.com',
    }, {
      'firstName': 'Levi',
      'lastName': 'Campbell',
      'address': {
        'street': '7349 Velvet Ridge',
        'city': 'Ijamsville',
        'state': 'North Carolina',
        'zip': '28729-0772',
        'country': 'USA',
        'phone': '(910) 555-0269',
      },
      'email': 'levi.campbell@company.com',
    }, {
      'firstName': 'Jaxon',
      'lastName': 'Cooper',
      'address': {
        'street': '981 Shady Dale Corners',
        'city': 'Hooker',
        'state': 'Minnesota',
        'zip': '55129-1867',
        'country': 'USA',
        'phone': '(218) 555-0005',
      },
      'email': 'jaxon.cooper@company.com',
    }, {
      'firstName': 'Allison',
      'lastName': 'Turner',
      'address': {
        'street': '9568 Broad Highway',
        'city': 'Lionilli',
        'state': 'Hawaii',
        'zip': '96725-0455',
        'country': 'USA',
        'phone': '(808) 555-7700',
      },
      'email': 'allison.turner@company.com',
    }, {
      'firstName': 'Ella',
      'lastName': 'Allen',
      'address': {
        'street': '2157 Easy Leaf Wharf',
        'city': 'Plenty Bears',
        'state': 'Illinois',
        'zip': '62792-5590',
        'country': 'USA',
        'phone': '(630) 555-9818',
      },
      'email': 'ella.allen@company.com',
    }, {
      'firstName': 'Zoe',
      'lastName': 'Young',
      'address': {
        'street': '7585 Sleepy Parkway',
        'city': 'Kilowatt',
        'state': 'Minnesota',
        'zip': '55105-3263',
        'country': 'USA',
        'phone': '(507) 555-0207',
      },
      'email': 'zoe.young@company.com',
    }, {
      'firstName': 'Dylan',
      'lastName': 'Jackson',
      'address': {
        'street': '9428 Jagged Grove',
        'city': 'Spirit Lake',
        'state': 'Rhode Island',
        'zip': '02906-5528',
        'country': 'USA',
        'phone': '(401) 555-8783',
      },
      'email': 'dylan.jackson@company.com',
    }];
  }

  render() {
    return html`
      <p>My table.</p>
      <vaadin-grid .items="${this.data}" theme="row-dividers" multiSort="true">
        <vaadin-grid-sort-column path="firstName" header="First name"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="lastName" header="Last name"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="email" header="Email"></vaadin-grid-sort-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('my-table', MyTable);
