import { LitElement, html, css } from 'lit';

export class HomeListPage extends LitElement {
  static styles = css`
    .page {
      padding: 24px;
      font-family: sans-serif;
    }
    nav {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    a {
      color: #0b57d0;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `;
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="page">
        <h1>Rick and Morty Dashboard</h1>
      </section>
    `;
  }
}

customElements.define('home-list', HomeListPage);