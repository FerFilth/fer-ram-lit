class RamStore {
  /**
  * Store principal con paginacion normal por API y paginacion local personalizada para modo favoritos.
   */
  constructor() {
    this.FAVORITES_KEY = 'ram-favorites';
    this.PAGE_SIZE = 20;
    this.state = {
      page: 1,
      search: '',
      loading: false,
      favoriteMode: false,
      collectionSize: 0,
      characters: [],
      favorites: this.loadFavorites(),
    };
    this.listeners = new Set();
    this.debounceId = null;
    this.abortController = null;
    this.favoritesCache = [];
    this.favoritesCacheKey = '';
  }

  /**
   * @returns {{page:number,search:string,loading:boolean,favoriteMode:boolean,collectionSize:number,characters:Array, favorites:Set<number>}}
   */
  getState() {
    return this.state;
  }

  /**
   * @param {(state: object) => void} listener
   * @returns {() => boolean}
   */
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state); // snapshot inicial
    return () => this.listeners.delete(listener);
  }

  /**
   * @param {object} patch
   */
  setState(patch) {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener(this.state);
  }

  /**
   * @param {number} page
   * @param {string} name
   * @returns {Promise<any|null>}
   */
  async fetchCharacters(page = 1, name = '', signal) {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character?page=${page}&name=${encodeURIComponent(name)}`,
      { signal },
    );
    if (!res.ok) return null;
    return res.json();
  }

  /**
    * Obtiene personajes favoritos por IDs.
    * La API devuelve un objeto para un solo id y un arreglo para multiples ids.
   * @param {number[]} ids
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array<object>>}
   */
  async fetchCharactersByIds(ids, signal) {
    if (!Array.isArray(ids) || ids.length === 0) return [];

    const endpoint = `https://rickandmortyapi.com/api/character/${ids.join(',')}`;

    try {
      const res = await fetch(endpoint, { signal });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      return [];
    }
  }

  /**
    * Construye la respuesta paginada a partir de IDs favoritos,
    * busqueda local y paginacion local.
   * @param {number} page
   * @param {string} search
   * @param {Set<number>} favoriteIds
   * @param {AbortSignal} [signal]
   * @returns {Promise<{characters: Array<object>, count: number, page: number}>}
   */
  async fetchFavorites(page, search, favoriteIds, signal) {
    const ids = Array.from(favoriteIds);
    if (ids.length === 0) {
      return { characters: [], count: 0, page: 1 };
    }

    const cacheKey = [...ids].sort((a, b) => a - b).join(',');
    let allCharacters = [];

    if (cacheKey === this.favoritesCacheKey && this.favoritesCache.length > 0) {
      allCharacters = this.favoritesCache;
    } else {
      allCharacters = await this.fetchCharactersByIds(ids, signal);
      this.favoritesCache = allCharacters;
      this.favoritesCacheKey = cacheKey;
    }

    const normalizedSearch = String(search ?? '').trim().toLowerCase();
    const filtered = normalizedSearch
      ? allCharacters.filter((character) =>
          String(character?.name ?? '')
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : allCharacters;

    const count = filtered.length;
    const totalPages = Math.ceil(count / this.PAGE_SIZE);
    const safePage = totalPages > 0 ? Math.min(Math.max(page, 1), totalPages) : 1;
    const start = (safePage - 1) * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE;

    return {
      characters: filtered.slice(start, end),
      count,
      page: safePage,
    };
  }

  /**
    * Dispara la carga de datos segun el modo actual:
    * modo normal => paginacion por API
    * modo favoritos => paginacion local + busqueda local sobre IDs favoritos
   */
  triggerUpdate() {
    clearTimeout(this.debounceId);
    this.setState({ loading: true });

    // Si habia un fetch anterior en curso, lo cancelamos
    this.abortController?.abort();
    this.abortController = new AbortController();

    this.debounceId = setTimeout(async () => {
      try {
        const { page, search, favoriteMode, favorites } = this.state;

        if (favoriteMode) {
          const favoritesData = await this.fetchFavorites(
            page,
            search,
            favorites,
            this.abortController.signal,
          );

          this.setState({
            characters: favoritesData.characters,
            collectionSize: favoritesData.count,
            page: favoritesData.page,
            loading: false,
          });
          return;
        }

        const data = await this.fetchCharacters(
          page,
          search,
          this.abortController.signal,
        );
        this.setState({
          characters: data?.results ?? [],
          collectionSize: data?.info?.count ?? 0,
          loading: false,
        });
      } catch (err) {
        if (err.name === 'AbortError') return; // cancelado, no hacemos nada
        this.setState({
          characters: [],
          collectionSize: 0,
          loading: false,
        });
      }
    }, 300);
  }

  /**
   * @param {number} page
   */
  setPage(page) {
    this.setState({ page });
    this.triggerUpdate();
  }

  /**
   * @param {string} search
   */
  setSearch(search) {
    this.setState({ search, page: 1 });
    this.triggerUpdate();
  }

  /**
   * @param {boolean} active
   */
  setFavoriteMode(active) {
    this.favoritesCache = [];
    this.favoritesCacheKey = '';
    this.setState({ favoriteMode: Boolean(active), page: 1 });
    this.triggerUpdate();
  }

  /**
   * @returns {Set<number>}
   */
  loadFavorites() {
    const raw = localStorage.getItem(this.FAVORITES_KEY);
    if (!raw) return new Set();

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch {
      return new Set();
    }
  }

  
  saveFavorites() {
    localStorage.setItem(
      this.FAVORITES_KEY,
      JSON.stringify(Array.from(this.state.favorites)),
    );
  }

  /**
   * @param {number} characterId
   * @returns {boolean}
   */
  isFavorite(characterId) {
    return this.state.favorites.has(characterId);
  }

  /**
   * @param {number} characterId
    * @returns {boolean} true si el personaje queda como favorito tras activar/desactivar la opcion
   */
  toggleFavorite(characterId) {
    const favorites = new Set(this.state.favorites);

    if (favorites.has(characterId)) {
      favorites.delete(characterId);
    } else {
      favorites.add(characterId);
    }

    this.favoritesCache = [];
    this.favoritesCacheKey = '';

    const nextPatch = { favorites };
    if (this.state.favoriteMode) {
      nextPatch.page = 1;
    }

    this.setState(nextPatch);
    this.saveFavorites();

    if (this.state.favoriteMode) {
      this.triggerUpdate();
    }

    return favorites.has(characterId);
  }

  /**
   * @returns {number[]}
   */
  getFavoriteIds() {
    return Array.from(this.state.favorites);
  }
}

export const ramStore = new RamStore();
