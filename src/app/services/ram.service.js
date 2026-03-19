class RamStore {
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

  
  triggerUpdate() {
    clearTimeout(this.debounceId);
    this.setState({ loading: true });

    // Si había un fetch anterior en curso, lo cancelamos
    this.abortController?.abort();
    this.abortController = new AbortController();

    this.debounceId = setTimeout(async () => {
      try {
        const { page, search } = this.state;
        const data = await this.fetchCharacters(page, search, this.abortController.signal);
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
   * @returns {boolean} True si el personaje es el favorito tras activar/desactivar la opcion
   */
  toggleFavorite(characterId) {
    const favorites = new Set(this.state.favorites);

    if (favorites.has(characterId)) {
      favorites.delete(characterId);
    } else {
      favorites.add(characterId);
    }

    this.setState({ favorites });
    this.saveFavorites();
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
