import { LitElement, html, css } from 'lit';
import { shadowReset } from '../../styles/shadow-reset.js';
import { iconFonts } from '../../styles/icon-fonts.js';

/**
 * Error page shown when route is not found.
 */
export class ErrorPage extends LitElement {
  static styles = [
    shadowReset,
    iconFonts,
    css`
      :host {
        --error-accent-a: #d423e4;
        --error-accent-b: #1dd4b6;
        --error-title-color: var(--text-color, #1a1a2e);
        --error-message-color: var(--error-muted-color, #555555);
        --error-button-shadow: rgba(212, 35, 228, 0.25);

        display: grid;
        place-items: center;
        min-height: 100svh;
        background-color: var(--bg-color, #fdfbf6);
        padding: 2rem;
      }

      .error-content {
        text-align: center;
        max-width: 480px;
        animation: fadeInUp 0.6s ease-out;
      }

      .error-code {
        font-size: clamp(6rem, 15vw, 10rem);
        font-weight: 800;
        line-height: 1;
        margin: 0;
        background: linear-gradient(135deg, var(--error-accent-a), var(--error-accent-b));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: pulse 3s ease-in infinite;
      }

      .error-title {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0.5rem 0 1rem;
        color: var(--error-title-color);
      }

      .error-message {
        font-size: 1.05rem;
        color: var(--error-message-color);
        line-height: 1.7;
        margin-bottom: 2rem;
      }

      .btn-home {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 12px 24px;
        background: linear-gradient(135deg, var(--error-accent-a), var(--error-accent-b));
        color: #ffffff;
        font-weight: 600;
        font-size: 1rem;
        border: none;
        border-radius: 50px;
        text-decoration: none;
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease;
      }

      .btn-home:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px var(--error-button-shadow);
        color: #ffffff;
      }

      .btn-home:active {
        transform: translateY(-1px);
      }

      .btn-home:focus-visible {
        outline: 2px solid var(--primary-color, #0b57d0);
        outline-offset: 2px;
      }

      .btn-icon {
        font-size: 1.25rem;
        font-variation-settings:
          'FILL' 1,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }

        50% {
          opacity: 0.75;
        }
      }
    `,
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
