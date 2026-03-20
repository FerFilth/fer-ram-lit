import { fixture, html, expect } from '@open-wc/testing';
import sinon from 'sinon';

import './home-list.js';
import { ramStore } from '../../services/ram.service.js';

const mockCharacter = {
	id: 1,
	name: 'Rick Sanchez',
	image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

describe('home-list', () => {
	let subscribeStub;
	let triggerUpdateStub;
	let setSearchStub;
	let setFavoriteModeStub;
	let unsubscribeSpy;

	beforeEach(() => {
		unsubscribeSpy = sinon.spy();
		subscribeStub = sinon.stub(ramStore, 'subscribe').callsFake((listener) => {
			listener({
				loading: false,
				favoriteMode: false,
				characters: [mockCharacter],
			});
			return unsubscribeSpy;
		});

		triggerUpdateStub = sinon.stub(ramStore, 'triggerUpdate');
		setSearchStub = sinon.stub(ramStore, 'setSearch');
		setFavoriteModeStub = sinon.stub(ramStore, 'setFavoriteMode');
	});

	afterEach(() => {
		sinon.restore();
		document.documentElement.removeAttribute('data-theme');
		localStorage.removeItem('theme');
	});

	it('creates the component', async () => {
		const el = await fixture(html`<home-list></home-list>`);
		expect(el).to.exist;
	});

	it('subscribes to store and loads data on connect', async () => {
		const el = await fixture(html`<home-list></home-list>`);

		expect(subscribeStub.called).to.equal(true);
		expect(triggerUpdateStub.called).to.equal(true);
		expect(el.characters.length).to.equal(1);
		expect(el.characters[0].name).to.equal('Rick Sanchez');
	});

	it('calls setSearch on search', async () => {
		const el = await fixture(html`<home-list></home-list>`);
		el.onSearch(new CustomEvent('item', { detail: 'morty' }));

		expect(setSearchStub.calledOnceWithExactly('morty')).to.equal(true);
	});

	it('toggles favorite mode', async () => {
		const el = await fixture(html`<home-list></home-list>`);
		el.showOnlyFavorites = false;
		el.toggleFavorite();

		expect(setFavoriteModeStub.calledOnceWithExactly(true)).to.equal(true);
	});

	it('opens and closes modal from handlers', async () => {
		const el = await fixture(html`<home-list></home-list>`);

		el.onOpenCharacterModal(
			new CustomEvent('open-character-modal', {
				detail: { character: mockCharacter },
			}),
		);

		expect(el.isModalOpen).to.equal(true);
		expect(el.modalCharacter?.id).to.equal(1);

		el.onCloseCharacterModal();
		expect(el.isModalOpen).to.equal(false);
	});

	it('renders default title', async () => {
		const el = await fixture(html`<home-list></home-list>`);
		const title = el.shadowRoot.querySelector('h1');

		expect(title?.textContent?.trim()).to.equal('Wubba lubba dub dub!');
	});

	it('renders favorites title when active', async () => {
		const el = await fixture(html`<home-list></home-list>`);
		el.showOnlyFavorites = true;
		await el.updateComplete;

		const title = el.shadowRoot.querySelector('h1');
		expect(title?.textContent?.trim()).to.equal('Mis favoritos');
	});

	it('unsubscribes on disconnect', async () => {
		const el = await fixture(html`<home-list></home-list>`);
		el.remove();

		expect(unsubscribeSpy.called).to.equal(true);
	});
});
