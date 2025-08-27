import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the fhir client used by routes
const postMock = vi.fn(async (_url: string, body: any) => ({ status: 201, data: { ...body, id: 'test-id' } }));
const getMock = vi.fn(async (_url: string, _opts?: any) => ({ status: 200, data: { resourceType: 'Bundle', total: 0 } }));
vi.mock('../fhirClient', () => ({ fhir: { post: postMock, get: getMock } }));

import app from '../server';

describe('Gateway tenant handling', () => {
  beforeEach(() => {
    postMock.mockClear();
    getMock.mockClear();
  });

  it('adds meta.tag tenant on Patient create', async () => {
    const patient = { resourceType: 'Patient', name: [{ given: ['John'], family: 'Doe' }] };
    const res = await request(app)
      .post('/api/patients')
      .set('X-Org-Id', 'HOSP-A')
      .send(patient)
      .expect(201);

    expect(postMock).toHaveBeenCalledTimes(1);
    const sent = postMock.mock.calls[0][1];
    const tag = sent?.meta?.tag?.find((t: any) => t.system === 'https://example.org/tenant' && t.code === 'HOSP-A');
    expect(tag).toBeTruthy();
    expect(res.body.id).toBe('test-id');
  });

  it('applies _tag filter on Patient list', async () => {
    await request(app)
      .get('/api/patients')
      .set('X-Org-Id', 'HOSP-B')
      .expect(200);

    expect(getMock).toHaveBeenCalledTimes(1);
    const params = getMock.mock.calls[0][1]?.params;
    expect(params?._tag).toBe('https://example.org/tenant|HOSP-B');
  });
}); 