import { LitElement, html, css } from 'lit';
import './pages/home-list/home-list.js';
import './pages/error/error.js';

export class AppComponent extends LitElement {
  static properties = {
    currentPath: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 100svh;
      box-sizing: border-box;
    }
  `;

  constructor(parameters) {
    super();
    this.currentPath = window.location.pathname;
    this.searchQuery = this.getSearchQueryFromUrl();
    this.applyStoredTheme();

    this.onPopState = () => {
      this.currentPath = window.location.pathname;
    };

    this.onHistoryChange = () => {
      this.currentPath = window.location.pathname;
    };

    this.onDocumentClick = (event) => {
      const path = event.composedPath();
      const anchor = path.find((el) => el?.tagName === 'A');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('#')
      )
        return;
      if (anchor.hasAttribute('target') || anchor.hasAttribute('download'))
        return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      event.preventDefault();
      this.navigate(href);
    };
  }

  applyStoredTheme() {
    const storedTheme = localStorage.getItem('theme');
    const root = document.documentElement;

    if (storedTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      return;
    }

    root.removeAttribute('data-theme');
  }

  toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      root.removeAttribute('data-theme'); // o setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light'); // Opcional: guardar preferencia
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark'); // Opcional: guardar preferencia
    }
  }

  getSearchQueryFromUrl() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('search') || '';
  }
  navigate(path) {
    // Para navegación con parámetros: this.navigate('/rick-and-morty/home?search=rick')
    const [pathname, search] = path.split('?');
    // Actualizar la URL solo si el pathname o los parámetros de búsqueda han cambiado
    if (
      pathname !== this.currentPath ||
      search !== window.location.search.substring(1)
    ) {
      window.history.pushState({}, '', path);
      this.currentPath = pathname;
      this.searchQuery = this.getSearchQueryFromUrl();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this.onPopState);
    document.addEventListener('click', this.onDocumentClick);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.onPopState);
    document.removeEventListener('click', this.onDocumentClick);
    super.disconnectedCallback();
  }

  navigate(path) {
    if (path === this.currentPath) return;
    window.history.pushState({}, '', path);
    this.currentPath = path;
  }

  render() {
    switch (this.currentPath) {
      case '/':
      case '/rick-and-morty':
      case '/rick-and-morty/home':
        return html`<home-list .searchQuery="${this.searchQuery}"></home-list>`;
      case '/rick-and-morty/error':
        return html`<error-page></error-page>`;
      default:
        // Si no conoce la ruta, mostramos error
        return html`<error-page></error-page>`;
    }
  }
}

customElements.define('app-root', AppComponent);