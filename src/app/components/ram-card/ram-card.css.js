import { css } from "lit";

export const shadowReset = css`
  :host {
    display: block;
    height: 100%;
  }

  .ram-card-root {
    height: 100%;
    border: 1px solid var(--border-color, #d7dce3);
    border-radius: 0.75rem;
    background: var(--surface-color, #ffffff);
    box-shadow: 0 4px 14px rgba(10, 26, 47, 0.08);
    overflow: hidden;
  }

  .ram-card-body {
    height: 100%;
    padding: 0.65rem;
    display: grid;
    gap: 0.6rem;
  }

  .ram-card-image-box {
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: 0.55rem;
    overflow: hidden;
    background: radial-gradient(
      circle at 20% 20%,
      #f4f6f9 0%,
      #eceff4 45%,
      #e5e9ef 100%
    );
  }

  .ram-card-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }

  .ram-card-loader {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
  }

  .ram-card-spinner {
    width: 34px;
    height: 34px;
    animation: ram-card-spin 0.8s linear infinite;
  }

  .ram-card-spinner-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .ram-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .ram-card-title {
    margin: 0;
    font-size: 0.96rem;
    line-height: 1.35;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-color, #111111);
  }

  .ram-card-favorite {
    min-width: 24px;
    min-height: 24px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    color: #6c757d;
    transition: background-color 0.2s ease;
  }

  .ram-card-favorite:hover {
    background: #eef2f7;
  }

  .ram-card-favorite-icon {
    font-size: 1.3rem;
    user-select: none;
  }

  .ram-card-favorite[data-active="true"] {
    color: #ffbf2f;
  }

  .ram-card-favorite[data-active="true"] .ram-card-favorite-icon {
    font-variation-settings:
      "FILL" 1,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
  }

  .ram-card-favorite[data-active="false"] .ram-card-favorite-icon {
    font-variation-settings:
      "FILL" 0,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
  }

  @keyframes ram-card-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
