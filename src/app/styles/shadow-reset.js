import { css } from 'lit';

export const shadowReset = css`
  /* 1. Box sizing global en el shadow DOM */
  :host,
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :host {
    font-family: var(
      --font-family-base,
      'Roboto',
    );
  }

  /* 2. Quitar márgenes y paddings por defecto en elementos comunes */
  h1, h2, h3, h4, h5, h6, 
  p, figure, blockquote, dl, dd {
    margin: 0;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none; /* muy común quitar viñetas por defecto */
  }

  /* 3. Evitar que imágenes desborden sus contenedores y forzar comportamiento inline correcto */
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  /* 4. Heredar tipografía en inputs/botones (por defecto los forms tienen sus propias fuentes) */
  input, button, textarea, select {
    font: inherit;
    color: inherit;
  }

  /* 5. Asegurar que los botones no tengan estilos molestos por defecto  */
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    box-shadow: none;
  }

  button:focus,
  button:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

