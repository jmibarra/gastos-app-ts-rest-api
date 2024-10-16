// tests/middlewares/index.test.ts
import { isOwner } from '../../middlewares';
import { get } from 'lodash';

jest.mock('lodash', () => ({
  get: jest.fn(),
}));

describe('isOwner Middleware', () => {
  const mockRequest = (identity: any, params: any) => ({
    params,
    identity,
  });

  const mockResponse = () => {
    const res = {} as any;
    res.sendStatus = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('debería devolver 400 si no hay `identity._id` en la request', async () => {
    (get as jest.Mock).mockReturnValue(null);

    const req = mockRequest({}, { id: 'user-id' });
    const res = mockResponse();

    await isOwner(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  it('debería devolver 403 si el usuario no es el propietario', async () => {
    (get as jest.Mock).mockReturnValue('different-id');

    const req = mockRequest({ _id: 'different-id' }, { id: 'user-id' });
    const res = mockResponse();

    await isOwner(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('debería llamar a next si el usuario es el propietario', async () => {
    (get as jest.Mock).mockReturnValue('user-id');

    const req = mockRequest({ _id: 'user-id' }, { id: 'user-id' });
    const res = mockResponse();

    await isOwner(req as any, res as any, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
