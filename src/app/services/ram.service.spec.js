import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { ramStore } from './ram.service.js';

function resetStoreState() {
  clearTimeout(ramStore.debounceId);
  ramStore.abortController?.abort();
  ramStore.listeners.clear();
  ramStore.debounceId = null;
  ramStore.abortController = null;
  ramStore.favoritesCache = [];
  ramStore.favoritesCacheKey = '';
  ramStore.state = {
    page: 1,
    search: '',
    loading: false,
    favoriteMode: false,
    collectionSize: 0,
    characters: [],
    favorites: new Set(),
  };
}

describe('ramStore', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStoreState();
  });

  afterEach(() => {
    sinon.restore();
    resetStoreState();
  });

  it('returns current state', () => {
    const state = ramStore.getState();
    expect(state.page).to.equal(1);
    expect(state.search).to.equal('');
  });

  it('updates page through setPage', () => {
    const triggerSpy = sinon.stub(ramStore, 'triggerUpdate');

    ramStore.setPage(3);

    expect(ramStore.state.page).to.equal(3);
    expect(triggerSpy.calledOnce).to.equal(true);
  });

  it('updates search and resets page in setSearch', () => {
    const triggerSpy = sinon.stub(ramStore, 'triggerUpdate');

    ramStore.state.page = 5;
    ramStore.setSearch('morty');

    expect(ramStore.state.search).to.equal('morty');
    expect(ramStore.state.page).to.equal(1);
    expect(triggerSpy.calledOnce).to.equal(true);
  });

  it('updates favorite mode and resets page', () => {
    const triggerSpy = sinon.stub(ramStore, 'triggerUpdate');

    ramStore.state.page = 7;
    ramStore.setFavoriteMode(true);

    expect(ramStore.state.favoriteMode).to.equal(true);
    expect(ramStore.state.page).to.equal(1);
    expect(triggerSpy.calledOnce).to.equal(true);
  });

  it('toggles favorite on and off', () => {
    expect(ramStore.isFavorite(1)).to.equal(false);

    const active = ramStore.toggleFavorite(1);
    expect(active).to.equal(true);
    expect(ramStore.isFavorite(1)).to.equal(true);

    const inactive = ramStore.toggleFavorite(1);
    expect(inactive).to.equal(false);
    expect(ramStore.isFavorite(1)).to.equal(false);
  });

  it('persists favorites to localStorage', () => {
    ramStore.toggleFavorite(5);

    const stored = localStorage.getItem('ram-favorites');
    expect(stored).to.be.a('string');
    expect(JSON.parse(stored)).to.deep.equal([5]);
  });

  it('fetchCharacters returns json data when response is ok', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => ({ info: { count: 1 }, results: [{ id: 1 }] }),
    });

    const result = await ramStore.fetchCharacters(1, 'rick');

    expect(fetchStub.calledOnce).to.equal(true);
    expect(result.results.length).to.equal(1);
  });

  it('fetchCharacters returns null when response is not ok', async () => {
    sinon.stub(window, 'fetch').resolves({ ok: false });

    const result = await ramStore.fetchCharacters(1, 'invalid');

    expect(result).to.equal(null);
  });

  it('fetchCharactersByIds returns empty array for empty ids', async () => {
    const fetchStub = sinon.stub(window, 'fetch');

    const result = await ramStore.fetchCharactersByIds([]);

    expect(result).to.deep.equal([]);
    expect(fetchStub.called).to.equal(false);
  });

  it('fetchCharactersByIds normalizes single object response', async () => {
    sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => ({ id: 1, name: 'Rick' }),
    });

    const result = await ramStore.fetchCharactersByIds([1]);

    expect(Array.isArray(result)).to.equal(true);
    expect(result.length).to.equal(1);
    expect(result[0].id).to.equal(1);
  });

  it('triggerUpdate updates state from API data in normal mode', async () => {
    const clock = sinon.useFakeTimers();
    const fetchStub = sinon
      .stub(ramStore, 'fetchCharacters')
      .resolves({ info: { count: 1 }, results: [{ id: 1, name: 'Rick' }] });

    ramStore.setState({ favoriteMode: false, page: 1, search: '' });
    ramStore.triggerUpdate();

    expect(ramStore.state.loading).to.equal(true);
    await clock.tickAsync(301);

    expect(fetchStub.calledOnce).to.equal(true);
    expect(ramStore.state.collectionSize).to.equal(1);
    expect(ramStore.state.characters.length).to.equal(1);
    expect(ramStore.state.loading).to.equal(false);

    clock.restore();
  });
});
