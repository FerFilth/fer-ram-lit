import { css } from "lit";

export const homeListStyles = css`
  :host {
    display: block;
    background: var(--bg-color);
    color: var(--text-color);
    width: 100%;
    min-height: 100%;
    height: 100%;
  }

  .home-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .grid-home-page {
    background-color: var(--bg-color);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: 1rem;
    padding: 18px 18px 9px 18px;
    height: 100%;
    overflow: hidden;
  }

  .grid-content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto auto;
    gap: 8px;
    overflow: hidden;
    min-height: 0;
  }

  .grid-content .action-bar {
    display: flex;
    min-height: 45px;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .grid-scroll-container {
    overflow-y: auto;
    min-height: 0;
    border-radius: 10px;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: var(--border-color) transparent;
  }

  ///#region etilos personalizados para las barras de desplazamiento en los navegadores WebKit
  .grid-scroll-container::-webkit-scrollbar {
    width: 8px;
  }

  .grid-scroll-container::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }

  .grid-scroll-container::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 4px;
  }

  .grid-scroll-container::-webkit-scrollbar-thumb:hover {
    background-color: var(--primary-color);
  }
  //#endregion estilos personalizados para las barras de desplazamiento en los navegadores WebKit

  .section-row,
  .full-col {
    width: 100%;
  }

  .header-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }

  .theme-toggle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 38px;
    min-height: 38px;
    border: 1px solid var(--border-color, #cbced1);
    border-radius: 999px;
    background: var(--surface-color, #ffffff);
    color: var(--text-color, #111111);
    transition:
      transform 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
  }

  .theme-toggle-btn:hover {
    transform: translateY(-1px);
    background: var(--btn-secondary-bg, #ffffff);
    border-color: var(--btn-secondary-border, #dee2e6);
  }

  .theme-toggle-icon {
    font-size: 1.2rem;
    font-variation-settings:
      "FILL" 1,
      "wght" 500,
      "GRAD" 0,
      "opsz" 24;
  }

  .center-text {
    text-align: center;
  }

  .mb-0 {
    margin-bottom: 0;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .mb-3 {
    margin-bottom: 1rem;
  }

  .mt-4 {
    margin-top: 1.5rem;
  }

  .block {
    display: block;
  }

  .favorites-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.25rem;
  }

  .info-alert {
    padding: 1rem;
    border-radius: 8px;
    background: #e7f1ff;
    color: #084298;
    text-align: center;
  }

  .icon-xl {
    font-size: 2.5rem;
  }

  .favorite-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border: none;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
  }

  .favorite-button .favorite-icon {
    cursor: pointer;
    user-select: none;
    color: #6c757d;
    font-variation-settings:
      "FILL" 0,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
    transition: all 0.2s ease;
  }

  .favorite-button.is-active .favorite-icon {
    font-variation-settings:
      "FILL" 1,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
  }

  .favorite-button.is-active:hover {
    background-color: var(--btn-primary-bg);
    transform: scale(1.05);
  }

  .favorite-button.is-active:hover .favorite-icon {
    color: #e9d9a9;
  }

  .favorite-button:not(.is-active):hover {
    background-color: #e9ecef;
    transform: scale(1.05);
  }

  .favorite-button:not(.is-active):hover .favorite-icon {
    color: #ffc107;
    font-variation-settings:
      "FILL" 1,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
  }

  .favorite-button.favorite-active {
    background-color: var(--btn-primary-bg);
  }

  .favorite-button.favorite-active .favorite-icon {
    color: #fff;
  }

  .favorite-button.favorite-inactive {
    background-color: #f8f9fa;
  }

  .favorite-button.favorite-inactive .favorite-icon {
    color: #6c757d;
  }

  :host([theme="dark"]) .favorite-button,
  :host([theme="dark"]) .favorite-button.favorite-active,
  :host([theme="dark"]) .favorite-button.favorite-inactive {
    background-color: var(--surface-color);
  }

  :host([theme="dark"]) .favorite-button .favorite-icon,
  :host([theme="dark"]) .favorite-button.favorite-active .favorite-icon,
  :host([theme="dark"]) .favorite-button.favorite-inactive .favorite-icon {
    color: #fff;
  }

  :host([theme="dark"]) .favorite-button:hover,
  :host([theme="dark"]) .favorite-button.is-active:hover,
  :host([theme="dark"]) .favorite-button:not(.is-active):hover {
    background-color: #000;
  }

  :host([theme="dark"]) .favorite-button:hover .favorite-icon,
  :host([theme="dark"]) .favorite-button.is-active:hover .favorite-icon,
  :host([theme="dark"]) .favorite-button:not(.is-active):hover .favorite-icon {
    color: #fff;
  }

  .favorite-button-label {
    font-weight: 600;
  }

  .grid-slot {
    width: 100%;
    height: 100%;
  }

  .empty-favorites-icon {
    font-variation-settings: "FILL" 0;
  }

  .micro-footer {
    text-align: center;
    padding-top: 6px;
    font-size: 0.85rem;
    color: var(--text-color);
    opacity: 0.7;
  }

  .micro-footer a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;
  }

  .micro-footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 720px) {
    .grid-content .action-bar {
      flex-direction: column;
      align-items: stretch;
    }

    .favorites-toolbar {
      justify-content: space-between;
    }
  }
`;
