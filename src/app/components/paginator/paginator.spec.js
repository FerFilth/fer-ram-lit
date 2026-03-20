import { fixture, html, expect } from '@open-wc/testing';
import sinon from 'sinon';

import './paginator.js';
import { ramStore } from '../../services/ram.service.js';

describe('app-paginator', () => {
	let subscribeStub;
	let setPageStub;
	let unsubscribeSpy;

	beforeEach(() => {
		unsubscribeSpy = sinon.spy();
		setPageStub = sinon.stub(ramStore, 'setPage');
		subscribeStub = sinon.stub(ramStore, 'subscribe').callsFake((listener) => {
			listener({ page: 1, collectionSize: 100 });
			return unsubscribeSpy;
		});
	});

	afterEach(() => {
		sinon.restore();
	});

	it('creates the component', async () => {
		const el = await fixture(html`<app-paginator></app-paginator>`);
		expect(el).to.exist;
	});

	it('initializes from store subscription', async () => {
		const el = await fixture(html`<app-paginator></app-paginator>`);

		expect(subscribeStub.calledOnce).to.equal(true);
		expect(el.page).to.equal(1);
		expect(el.totalItems).to.equal(100);
		expect(el.pageSize).to.equal(ramStore.PAGE_SIZE);
	});

	it('computes totalPages correctly', async () => {
		const el = await fixture(html`<app-paginator></app-paginator>`);
		el.totalItems = 200;
		el.pageSize = 20;

		expect(el.totalPages).to.equal(10);
	});

	it('computes visible pages with ellipsis', async () => {
		const el = await fixture(html`<app-paginator></app-paginator>`);
		el.totalItems = 200;
		el.pageSize = 20;
		el.page = 5;

		expect(el.visiblePages).to.deep.equal([1, -1, 4, 5, 6, -1, 10]);
	});

	it('calls setPage for a valid next page', async () => {
		const el = await fixture(html`<app-paginator></app-paginator>`);
		el.totalItems = 200;
		el.pageSize = 20;
		el.page = 1;

		el.onPageChange(2);

		expect(setPageStub.calledOnceWithExactly(2)).to.equal(true);
	});

	it('does not call setPage while loading', async () => {
		const el = await fixture(
			html`<app-paginator .isLoading=${true}></app-paginator>`,
		);

		el.onPageChange(2);
		expect(setPageStub.called).to.equal(false);
	});

	it('does not call setPage for invalid or same page', async () => {
		const el = await fixture(html`<app-paginator></app-paginator>`);
		el.totalItems = 40;
		el.pageSize = 20;
		el.page = 1;

		el.onPageChange(0);
		el.onPageChange(1);
		el.onPageChange(99);

		expect(setPageStub.called).to.equal(false);
	});

	it('unsubscribes on disconnect', async () => {
		const el = await fixture(html`<app-paginator></app-paginator>`);
		el.remove();

		expect(unsubscribeSpy.calledOnce).to.equal(true);
	});
});
