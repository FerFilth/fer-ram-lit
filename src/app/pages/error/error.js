import { LitElement, html, css } from 'lit';

export class ErrorPage extends LitElement {
  static styles = css`
    .page {
      padding: 24px;
      font-family: sans-serif;
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
        <h1>404</h1>
        <p>Ruta no encontrada.</p>
        <a href="/">Volver al inicio</a>
      </section>
    `;
  }
}

customElements.define('error-page', ErrorPage);
