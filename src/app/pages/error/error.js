import { LitElement, html, css } from 'lit';
import { shadowReset } from '../../styles/shadow-reset.js';
import { iconFonts } from '../../styles/icon-fonts.js';
import { errorStyles } from './error.css.js';

export class ErrorPage extends LitElement {
  static styles = [
    shadowReset,
    iconFonts,
    errorStyles,
  ];

  render() {
    return html`
      <section class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Pagina no encontrada</h2>
        <p class="error-message">
          Esta pagina no existe en este universo... ni en los otros 826.
        </p>
        <a href="/rick-and-morty" class="btn-home">
          <span class="material-symbols-outlined btn-icon">home</span>
          Volver al inicio
        </a>
      </section>
    `;
  }
}

customElements.define('error-page', ErrorPage);
